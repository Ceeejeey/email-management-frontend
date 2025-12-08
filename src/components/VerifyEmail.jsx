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
            <div className="bg-card-bg p-6 md:p-8 rounded-xl shadow-2xl border border-gray-800 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gold mb-4">Email Verification</h1>
                <p className="text-gray-300 text-lg leading-relaxed">{message}</p>
            </div>
        </div>
    );
};

export default VerifyEmail;
