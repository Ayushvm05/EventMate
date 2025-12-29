import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import InputField from '../../components/common/InputField';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setMessage("Success! Password updated.");
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2s
    } catch (err) {
      setError(err.response?.data || "Invalid or expired token.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) return <div className="text-center p-10 text-red-500">Invalid Link</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">New Password</h2>

        {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

        {!message && (
          <form onSubmit={handleSubmit}>
            <InputField 
              label="New Password" 
              type="password" 
              placeholder="Enter new password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <InputField 
              label="Confirm Password" 
              type="password" 
              placeholder="Confirm new password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;