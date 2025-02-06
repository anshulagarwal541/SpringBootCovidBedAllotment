import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserChangePassword() {
    const {
        url,
        error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType
    } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${url}/user`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
            }
        }).then((response) => {
            if (!response.data.error) {
                setCurrentUser(response.data)
            } else {
                setError(true)
                setErrorType("error")
                setErrorMessage(response.data.error)
            }
        }).catch((e) => {
            setError(true)
            setErrorType("error")
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (formData.get("password") != formData.get("retypePassword")) {
            setError(true)
            setErrorType("error")
            setErrorMessage("New password doesn't match please check and enter carefully")
            return;
        }
        const data=currentUser;
        data.password=formData.get("password");
        axios.put(`${url}/user/details/password`, currentUser, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
            }
        }).then((response) => {
            if (!response.data.error) {
                setError(true)
                setErrorType("success")
                setErrorMessage(response.data);
                navigate("/user/login");
            }
        }).catch((e) => {
            setError(true)
            setErrorType("error")
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data)
        })
        e.target.reset();
    }

    return (
        <div className='flex justify-center items-center min-h-[100vh] flex-col gap-5 py-10'>
            <p className='text-green-950 font-extrabold text-3xl py-10'>Change Password</p>
            <div className='w-full h-auto flex justify-center items-center'>
                {currentUser && (
                    <form onSubmit={handleSubmit} action="POST" className='bg-green-950 border-4 w-[70%] border-yellow-600 rounded-2xl p-10 flex flex-col gap-5'>
                        <div className='flex flex-col'>
                            <label
                                className='text-xl font-bold text-white'
                                htmlFor="name">Enter  New Password :</label>
                            <input
                                type="password"
                                id="name"
                                name="password"
                                className='border-2 rounded-2xl border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
                        </div>
                        <div className='flex flex-col'>
                            <label
                                className='text-xl font-bold text-white'
                                htmlFor="address">Re-type new Password :</label>
                            <input
                                type="password"
                                id="address"
                                name="retypePassword"
                                className='border-2 rounded-2xl  border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
                        </div>
                        <button className='bg-yellow-600 text-green-950 px-5 py-3 font-extrabold rounded-2xl'>Change Password</button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default UserChangePassword