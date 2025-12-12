// OTP Service for InnerLight App
// Communicates with backend for OTP authentication

const API_BASE_URL = '/api';

export interface OTPResponse {
    success: boolean;
    message: string;
    debug?: { otp: string };
}

export interface VerifyOTPResponse {
    success: boolean;
    message: string;
    verified?: boolean;
}

/**
 * Send OTP to a phone number
 */
export const sendOTP = async (phone: string): Promise<OTPResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Send OTP Error:', error);
        return {
            success: false,
            message: 'Failed to send OTP. Please try again.',
        };
    }
};

/**
 * Verify OTP for a phone number
 */
export const verifyOTP = async (phone: string, otp: string): Promise<VerifyOTPResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, otp }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return {
            success: false,
            message: 'Failed to verify OTP. Please try again.',
        };
    }
};

/**
 * Check if backend is running
 */
export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        return data.status === 'OK';
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
};
