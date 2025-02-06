import React, { useContext } from 'react'
import Footer from '../../components/Footer'
import { login, logo } from '../../../public/index.js'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../helpers/AuthContext.jsx'
import { Alert, Snackbar } from '@mui/material'

function UserRegister() {
    const { url, error, errorMessage, errorType, setError, setErrorType, setErrorMessage } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            user: {
                email: formData.get("email"),
                password: formData.get("password"),
                roles: ["USER"]
            }
        }
        axios.post(`${url}/register/user`, data).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Logged in as USER")
                console.log("response",response.data)
                sessionStorage.setItem("userAccessToken", response.data)
                navigate("/")
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error)
            }
        }).catch((e) => {
            console.log("error", e)
            setError(true)
            setErrorType("error")
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data)
        })
    }

    const handleClose = () => {
        setError(false)
        setErrorMessage(null)
        setErrorType(null)
    };

    return (
        <div className='bg-green-950 text-green-950'>
            {error && (
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    key={"top" + "center"}
                >
                    <Alert
                        severity={errorType}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
            <div className='min-h-lvh flex justify-center items-center'>
                <div className=' bg-white w-[80%] border-4 border-yellow-400 rounded-2xl h-auto text-green-950 flex flex-col justify-center items-center'>
                    <div className='w-full h-full gap-5 flex flex-col justify-around items-center px-2 py-5'>
                        <img src={logo} className='h-[2rem]' alt="" />
                        <p className='font-extrabold text-3xl'>User Register</p>
                        <form onSubmit={handleSubmit} action="POST" className='flex flex-col gap-3 w-full py-5'>
                            <div className='flex flex-col'>
                                <label
                                    className='font-bold text-xl'
                                    htmlFor="name">Enter Name :</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className='border-2 rounded-2xl border-green-950 px-3 py-3'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label
                                    className='font-bold text-xl'
                                    htmlFor="phone">Enter Phone No :</label>
                                <input
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    placeholder='example@gmail.com'
                                    className='border-2 rounded-2xl border-green-950 px-3 py-3'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label
                                    className='font-bold text-xl'
                                    htmlFor="email">Enter Email :</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder='example@gmail.com'
                                    className='border-2 rounded-2xl border-green-950 px-3 py-3'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label
                                    className='font-bold text-xl'
                                    htmlFor="password">Enter Password :</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className='border-2 rounded-2xl border-green-950 px-3 py-3'
                                />
                            </div>
                            <button className='bg-green-950 px-5 py-3 text-white font-bold rounded-2xl'>Login</button>
                        </form>
                        <div className='font-extrabold text-lg w-full text-center'>Already registered ?  <Link to="/user/login"><span className='text-blue-500'>Login</span></Link></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default UserRegister