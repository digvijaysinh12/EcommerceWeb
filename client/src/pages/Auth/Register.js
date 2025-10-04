import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [quetion, setQuetion] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`/api/v1/auth/register`, {
                name,
                email,
                password,
                phone,
                address,
                quetion,
            });

            if (res.data.success) {
                toast.success(res.data.message || 'Registration Successful!');
                navigate('/login'); // Redirect after success
            } else {
                toast.error(res.data.message || 'Registration Failed!');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Something Went Wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Register">
            <div className="form-container">
                <div className="mb-3 text-center">
                    <h4>REGISTER FORM</h4>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            placeholder="Enter Name"
                            required
                        />
                    </div>
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
                            type="number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control"
                            placeholder="Enter Phone"
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
                    <div className="mb-3">
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-control"
                            placeholder="Enter Address"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={quetion}
                            onChange={(e) => setQuetion(e.target.value)} // Corrected
                            className="form-control"
                            placeholder="Enter Your Favorite Sport Name"
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Register;
