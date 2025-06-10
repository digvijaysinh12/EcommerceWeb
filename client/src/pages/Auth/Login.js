import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/AuthStyle.css';
import { useAuth } from '../../context/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // For loading state
    const [auth, setAuth] = useAuth(); // Assuming useAuth manages authentication state

    const navigate = useNavigate();

    // Form handle function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true

        try {
            const res = await axios.post(`/api/v1/auth/login`, {
                email,
                password,
            });

            if (res.data.success) {
                toast.success(res.data.message || 'Login Successful!', {
                    onClose: () => navigate('/'), // Redirect after the toast message to home page
                });

                // Update the auth context and localStorage
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem('auth', JSON.stringify(res.data));
            } else {
                toast.error(res.data.message || 'Login Failed!');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Something Went Wrong');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Layout title="Login">
            <div className="form-container">
                <div className="mb-3 text-center">
                    <h4>LOGIN PAGE</h4>
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
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Enter Password"
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/forgot-password')}
                    >
                        Forgot Password
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
