import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../../components/common/InputField';
import { useAuth } from '../../context/AuthContext'; // <--- Import Auth Hook

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', 
    password: '',
    confirmPassword: '',
    role: 'User'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);

    // Call API via Context
    const result = await register(
        formData.name, 
        formData.email, 
        formData.password, 
        formData.phone, 
        formData.role
    );

    if (result.success) {
      alert("Registration Successful! Please login.");
      navigate('/login'); // Redirect to login page
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
        
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">Create Account</h2>
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField label="Full Name" type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
          <InputField label="Email Address" type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
          <InputField label="Phone Number" type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">I am a...</label>
            <select name="role" value={formData.role} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="User">Event Attendee (User)</option>
              <option value="Organizer">Event Organizer</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Password" type="password" name="password" placeholder="********" value={formData.password} onChange={handleChange} />
            <InputField label="Confirm" type="password" name="confirmPassword" placeholder="********" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-2 px-4 rounded transition duration-300 mt-4 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;