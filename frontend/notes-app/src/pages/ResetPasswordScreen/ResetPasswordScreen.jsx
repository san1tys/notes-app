import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        setPasswordError('');
        setConfirmPasswordError('');

        if (!password) {
            setPasswordError('Please enter a new password');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("/api/users/reset-password", {
                token,
                email,
                password,
            });

            setSuccessMessage('Password updated successfully. Redirecting to login...');
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            console.error(err);
            setPasswordError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center ">
            <div className="w-[500px] p-5 rounded-sm shadow-lg bg-white bg-opacity-90 border">
                <h1 className="text-2xl font-medium">Reset Your Password</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mt-5">
                        <label className="block mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            placeholder="Enter your new password"
                            className="w-full h-10 p-2 border rounded-md outline-none"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="text-red-500 text-sm">{passwordError}</span>
                    </div>

                    <div className="mt-5">
                        <label className="block mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Confirm your new password"
                            className="w-full h-10 p-2 border rounded-md outline-none"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span className="text-red-500 text-sm">{confirmPasswordError}</span>
                    </div>

                    <div className="mt-5">
                        <button
                            className="w-full bg-primary hover:bg-blue-600 p-2 rounded-lg text-white"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Confirm"}
                        </button>
                    </div>

                    {successMessage && (
                        <div className="mt-4 text-green-600 text-center font-semibold">
                            {successMessage}
                        </div>
                    )}

                    <div className="mt-5 text-center">
                        <a href="/login" className="text-black-500 font-semibold">
                            Back to login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordScreen;
