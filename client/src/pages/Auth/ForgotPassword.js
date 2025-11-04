import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL; // use env variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/auth/forgot-password`,
        { email, question, newPassword }
      );

      if (data?.success) {
        toast.success(data?.message || 'Password Reset Successful!', {
          onClose: () => navigate('/login'),
        });
        // Optional: clear inputs
        setEmail('');
        setQuestion('');
        setNewPassword('');
      } else {
        toast.error(data?.message || 'Password reset failed. Please try again.');
      }
    } catch (error) {
      console.error('Reset Password error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Reset Password">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter Your Favourite Sports Name"
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New Password"
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Submitting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
