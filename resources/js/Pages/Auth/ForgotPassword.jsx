import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

const csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
const ADMIN_EMAIL = 'nethmayasith2001@gmail.com';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1: Request code
    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await fetch('/forgot-password/send-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({}),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send code');
            setMessage('A code has been sent to the admin email.');
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify code
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await fetch('/forgot-password/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Invalid code');
            setMessage('Code verified. Please enter your new password.');
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const res = await fetch('/forgot-password/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({ code, password, password_confirmation: passwordConfirmation }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to reset password');
            setMessage('Password reset successful! You can now log in.');
            setStep(4);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Forgot Password
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {step === 1 && `A reset code will be sent to the admin email (${ADMIN_EMAIL}).`}
                            {step === 2 && 'Enter the code sent to the admin email.'}
                            {step === 3 && 'Set your new password.'}
                            {step === 4 && 'Password reset successful!'}
                        </p>
                    </div>
                    {error && <div className="text-red-600 text-center">{error}</div>}
                    {message && <div className="text-green-600 text-center">{message}</div>}
                    {step === 1 && (
                        <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Code'}
                            </button>
                        </form>
                    )}
                    {step === 2 && (
                        <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
                            <input
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter code"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>
                    )}
                    {step === 3 && (
                        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="New password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Confirm new password"
                                value={passwordConfirmation}
                                onChange={e => setPasswordConfirmation(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                    {step === 4 && (
                        <div className="text-center">
                            <a href="/login" className="text-blue-600 hover:underline">Back to Login</a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 