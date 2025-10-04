import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [quetion, setQuetion] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Form handle function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`/api/v1/auth/forgot-password`, {
                email,
                quetion,
                newPassword,
            });

            if (res.data.success) {
                toast.success(res.data.message || 'Password Reset Successful!', {
                    onClose: () => navigate('/login'),
                });
            } else {
                toast.error(res.data.message || 'Password reset failed. Please try again.');
            }
        } catch (error) {
            console.error('Reset Password error:', error);
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="form-container">
                <div className="mb-3 text-center">
                    <h4>RESET YOUR PASSWORD</h4>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            placeholder="Enter Email"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            value={quetion}
                            onChange={(e) => setQuetion(e.target.value)}
                            className="form-control"
                            placeholder="Enter Your Favourite Sports Name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter New Password"
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Reset'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
