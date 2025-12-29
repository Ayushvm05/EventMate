import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import InputField from '../../components/common/InputField';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const role = result.user.role; 
      
      // ✅ LOGIC PRESERVED: Check where the user came from
      // If state.from exists (e.g. from Event Page), go there.
      // Otherwise, follow normal role-based redirection.
      const fromPage = location.state?.from;

      if (role === 'ROLE_ORGANIZER' || role === 'ROLE_ADMIN') {
        navigate('/admin'); 
      } else {
        navigate(fromPage || '/'); 
      }
      
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField label="Email Address" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />

          <div className="flex justify-end mb-4">
            {/* ✅ NEW LOGIC: Navigates to the Forgot Password page */}
            <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </button>
          </div>

          <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-2 px-4 rounded transition duration-300 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <button type="button" onClick={() => navigate('/')} className="w-full mt-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
            Continue as Guest
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;