import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const ForgotPasswordScreen = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const submitHandler = async ({ email }) => {
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await axios.post('/api/users/forgot-password', { email });
            const response = res.data;

            if (res.status === 200) {
                setMessage(response.message || 'Password reset link sent to email');
            } else {
                setError('Something went wrong. Please try again later.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center min-h-screen items-center ">
            <div className="w-[500px] p-5 rounded-sm shadow-lg bg-white bg-opacity-90 border">
                <h1 className="text-xl lg:text-2xl font-medium mb-2">Forgot password?</h1>
                <p className="text-sm lg:text-base">
                    Don&#39;t worry, it happens all the time. Enter your email
                    below and we will send you a recovery email.
                </p>
                <p className="text-xs mt-2 text-gray-600">
                    <span>(OBS: </span>Check your spam box)
                </p>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="mb-3 mt-4">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="w-full mt-1 p-2 border rounded outline-none"
                            placeholder="example@email.com"
                            id="email"
                            autoFocus
                            {...register('email', {
                                required: 'Please enter a valid email',
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                                    message: 'Please use a valid email format',
                                },
                            })}
                        />
                        {errors.email && (
                            <div className="text-red-600 text-sm mt-1">
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                    <div className="mt-5">
                        <button
                            className="w-full bg-primary hover:bg-blue-600 p-2 rounded text-white transition"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Send'}
                        </button>
                    </div>
                </form>

                {message && (
                    <div className="mt-5 text-green-600 text-center font-semibold">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mt-5 text-red-600 text-center font-semibold">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;
