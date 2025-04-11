import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import useUserStore from "../../stores/useUserStore";


const Login = () => {


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const { setUser } = useUserStore();


    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.")
            return
        }

        if (!password) {
            setError("Please enter a valid password.")
            return
        }


        setError("")

        try {
            const response = await axiosInstance.post("/api/users/login", {
                email,
                password
            });

            if (response.data?.user) {
                setUser(response.data.user);
                navigate("/dashboard");
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }

    }


    return (
        <>
            <Navbar isAuthPage={true} />
            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-2xl mb-7">Login</h4>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-box" />

                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                        {error && (
                            <p className="text-red-500 text-xs pb-1">{error}</p>
                        )}

                        <button type="submit" className="btn-primary">
                            Login
                        </button>
                        <p className="text-sm text-center mt-4">
                            Not registered yet?{" "}
                            <Link to="/signup" className="font-medium text-primary underline">
                                Create an Account
                            </Link>
                        </p>
                        <div className="mt-4 text-sm text-center">

                            <Link
                                className="font-medium text-primary underline"
                                to="/forgot-password"
                            >
                                Forgot-password?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
