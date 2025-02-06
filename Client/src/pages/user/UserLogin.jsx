import React, { useContext } from 'react'
import Footer from '../../components/Footer'
import { login, logo } from '../../../public/index.js'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../../helpers/AuthContext.jsx'
import { Alert, Snackbar } from '@mui/material'

function UserLogin() {
    const { url, error, errorMessage, errorType, setError, setErrorType, setErrorMessage } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        }
        axios.post(`${url}/login/user`, data).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage("Logged in as USER")
                sessionStorage.setItem("userAccessToken", response.data)
                navigate("/")
            }
            else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error)
            }
        }).catch((e) => {
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
                <div className=' bg-white w-[80%] border-2 border-yellow-400 rounded-2xl h-[30rem] text-green-950 flex justify-center items-center'>
                    <div className="w-1/2 h-full">
                        <img src={login} className='w-full h-full border border-yellow-400 rounded-2xl' alt="login.jpg" />
                    </div>
                    <div className='w-1/2 h-full gap-5 flex flex-col justify-around items-center px-2'>
                        <img src={logo} className='h-[2rem]' alt="" />
                        <p className='font-extrabold text-3xl'>User Login</p>
                        <form onSubmit={handleLogin} action="POST" className='flex flex-col gap-3 w-full'>
                            <div className='flex flex-col'>
                                <label
                                    className='font-bold text-3xl'
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
                                    className='font-bold text-3xl'
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
                        <div className='w-full flex flex-col gap-2'>
                            <div className='font-extrabold text-lg w-full'>Not registered ?  <Link to="/user/register"><span className='text-blue-500'>Regiser</span></Link></div>
                            <div className='font-extrabold text-lg w-full'>Login as Admin ?  <Link to="/admin/login"><span className='text-blue-500'>Login</span></Link></div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default UserLogin