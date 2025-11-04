import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ make sure you have this hook

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    quetion: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [auth] = useAuth(); // ✅ get user auth info from context

  const BASE_URL = process.env.REACT_APP_API_URL;

  // ✅ If user already logged in → redirect to home (or dashboard)
  useEffect(() => {
    if (auth?.token) {
      toast.info("You are already logged in!");
      navigate("/");
    }
  }, [auth, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}/api/v1/auth/send-otp`, {
        email: formData.email,
      });
      if (data.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}/api/v1/auth/verify-otp`, {
        email: formData.email,
        otp,
      });
      if (data.success) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
      } else {
        toast.error("Invalid or expired OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify OTP before registration!");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${BASE_URL}/api/v1/auth/register`, formData);
      if (data.success) {
        toast.success(data.message || "Registration successful!", {
          onClose: () => navigate("/login"),
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          address: "",
          quetion: "",
        });
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Register">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "email", "phone", "password", "address", "quetion"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === "quetion"
                    ? "Favorite Sport Name"
                    : `Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`
                }
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="bg-yellow-500 text-white px-4 py-3 rounded hover:bg-yellow-600 transition"
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !otpVerified}
              className={`w-full py-3 rounded transition ${
                otpVerified
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
