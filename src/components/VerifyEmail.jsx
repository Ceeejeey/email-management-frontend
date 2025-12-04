import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const VerifyEmail = () => {
    const [message, setMessage] = useState('Verifying your email...');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const queryParams = new URLSearchParams(location.search);
            const token = queryParams.get('token');

            if (!token) {
                setMessage('Invalid or missing verification token.');
                return;
            }

            try {
                const response = await axios.post('/api/verify-email', { token });
                setMessage(response.data.message || 'Email verified successfully! Redirecting to Sign In...');

                setTimeout(() => {
                    navigate('/signin');
                }, 3000);
            } catch (error) {
                console.error('Error during email verification:', error.response?.data || error.message);
                setMessage(
                    error.response?.data?.message || 'Email verification failed. Please try again later.'
                );
            }
        };

        verifyEmail();
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
            <div className="bg-card-bg p-8 rounded-xl shadow-2xl border border-gray-800 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gold mb-4">Email Verification</h1>
                <p className="text-gray-300 text-lg">{message}</p>
            </div>
        </div>
    );
};

export default VerifyEmail;
