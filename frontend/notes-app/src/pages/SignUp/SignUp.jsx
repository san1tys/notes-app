import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { validateEmail } from '../../utils/helper'
import useUserStore from '../../stores/useUserStore';


const SignUp = () => {

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const { setUser } = useUserStore();


    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name) return setError("Please enter your name.");
        if (!validateEmail(email)) return setError("Please enter a valid email address.");
        if (!password) return setError("Please enter a password.");

        setError("");

        try {
            const response = await axiosInstance.post("/api/users/create-account", {
                fullname: name,
                email,
                password
            });

            if (response.data?.error) {
                setError(response.data.message || "An error occurred.");
                return;
            }

            if (response.data?.user) {
                setUser(response.data.user);
                navigate("/dashboard");
            }

        } catch (err) {
            if (err.response?.data?.errors) {
                setError(err.response.data.errors[0].msg);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };


    return (
        <>
            <Navbar isAuthPage={true} />
            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-2xl mb-7">SignUp</h4>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input-box" />
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-box" />


                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                        {error && (
                            <p className="text-red-500 text-xs pb-1">{error}</p>
                        )}

                        <button type="submit" className="btn-primary">
                            Create Account
                        </button>
                        <p className="text-sm text-center mt-4">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-primary underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp