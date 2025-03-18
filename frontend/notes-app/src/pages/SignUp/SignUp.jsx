import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { validateEmail } from '../../utils/helper'

const SignUp = () => {

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()

        if (!name) {
            setError("Please enter your name.")
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.")
            return
        }

        if (!password) {
            setError("Please enter a password.")
            return
        }


        setError("")

        try {
            const response = await axiosInstance.post("/api/users/create-account", {
                fullname: name,
                email: email,
                password: password
            })

            if (response.data && response.data.error) {
                setError(response.data.message || "An error occurred.");
                return;
            }

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken)
                console.log(response.data)
                navigate("/dashboard")
            }
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessage = err.response.data.errors[0].msg;
                setError(errorMessage);
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