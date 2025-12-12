const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map();

// Generate random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }

        // Validate phone number (basic validation)
        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ success: false, message: 'Invalid phone number. Must be 10 digits.' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP with expiry (5 minutes)
        otpStorage.set(phone, {
            otp: otp,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        const apiKey = process.env.FAST2SMS_API_KEY;
        const isDev = process.env.NODE_ENV !== 'production';
        // Check if API key is placeholder or empty
        const isPlaceholderKey = !apiKey;

        // DEVELOPMENT FALLBACK: If key is missing/placeholder in Dev, simulate success
        if (isDev && isPlaceholderKey) {
            console.log(`⚠️ DEV MODE: Simulating Fast2SMS. OTP for ${phone} is ${otp}`);
            return res.json({
                success: true,
                message: 'OTP sent successfully (Dev Mode)',
                debug: { otp }
            });
        }

        // Send OTP via Fast2SMS
        try {
            const response = await axios.post(
                'https://www.fast2sms.com/dev/bulkV2',
                {
                    route: 'v3',
                    sender_id: 'TXTIND',
                    message: `Your InnerLight OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`,
                    language: 'english',
                    numbers: phone
                },
                {
                    headers: {
                        authorization: apiKey
                    }
                }
            );

            console.log('Fast2SMS Response:', response.data);

            if (response.data.return === true) {
                return res.json({
                    success: true,
                    message: 'OTP sent successfully',
                    // Include OTP in dev response for easier testing
                    debug: isDev ? { otp } : undefined
                });
            } else {
                // FALLBACK for Logic Errors (e.g., Insufficient Balance) in Dev Mode
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`⚠️ SMS Logic Error. Falling back to Mock Mode. OTP is ${otp}`);
                    return res.json({
                        success: true,
                        message: 'OTP sent (Dev Fallback - Check Console)',
                        debug: { otp }
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP via SMS Provider',
                    error: response.data
                });
            }
        } catch (smsError) {
            console.error('Fast2SMS Error:', smsError.response?.data || smsError.message);

            // FALLBACK: If SMS fails (e.g., no balance, invalid key), allow user to proceed in Dev/Test
            // This ensures functionality isn't blocked by 3rd party service issues.
            if (process.env.NODE_ENV !== 'production') {
                console.log(`⚠️ SMS Failed. Falling back to Mock Mode. OTP is ${otp}`);
                return res.json({
                    success: true,
                    message: 'OTP sent (Dev Fallback - Check Console)',
                    debug: { otp }
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP via SMS service',
                error: smsError.response?.data || smsError.message
            });
        }

    } catch (error) {
        console.error('Send OTP Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and OTP are required'
            });
        }

        // Check if OTP exists for this phone
        const storedData = otpStorage.get(phone);

        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found for this phone number. Please request a new OTP.'
            });
        }

        // Check if OTP has expired
        if (Date.now() > storedData.expiresAt) {
            otpStorage.delete(phone);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Verify OTP
        if (storedData.otp === otp) {
            // OTP is correct, remove it from storage
            otpStorage.delete(phone);
            return res.json({
                success: true,
                message: 'OTP verified successfully',
                verified: true
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try again.'
            });
        }

    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'InnerLight Backend is running' });
});

// Clean up expired OTPs every minute
setInterval(() => {
    const now = Date.now();
    for (const [phone, data] of otpStorage.entries()) {
        if (now > data.expiresAt) {
            otpStorage.delete(phone);
            console.log(`Cleaned up expired OTP for ${phone}`);
        }
    }
}, 60 * 1000);

app.listen(PORT, () => {
    console.log(`🚀 InnerLight Backend running on http://localhost:${PORT}`);
    console.log(`📱 OTP endpoints ready`);
});
