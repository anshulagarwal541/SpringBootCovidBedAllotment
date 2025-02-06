import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../helpers/AuthContext';
import axios from 'axios';

function UserUpdateDetails() {
  const {
    url,
    error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType
  } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    axios.get(`${url}/user/details`, {
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
    const data = currentUser;
    const formData = new FormData(e.target);
    axios.put(`${url}/user/details`, currentUser, {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
      }
    }).then((response) => {
      if (!response.data.error) {
        setError(true)
        setErrorType("success")
        setErrorMessage(response.data);
      }
    }).catch((e) => {
      setError(true)
      setErrorType("error")
      setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data)
    })
  }

  return (
    <div className='flex justify-center items-center min-h-[100vh] flex-col gap-5 py-10'>
      <p className='text-green-950 font-extrabold text-3xl py-10'>Update Details</p>
      <div className='w-full h-auto flex justify-center items-center'>
        {currentUser && (
          <form onSubmit={handleSubmit} action="POST" className='bg-green-950 border-4 w-[70%] border-yellow-600 rounded-2xl p-10 flex flex-col gap-5'>
            <div className='flex flex-col'>
              <label
                className='text-xl font-bold text-white'
                htmlFor="name">Enter  Name :</label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                className='border-2 rounded-2xl border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
            </div>
            <div className='flex flex-col'>
              <label
                className='text-xl font-bold text-white'
                htmlFor="address">Enter Phone :</label>
              <input
                type="number"
                id="address"
                name="phone"
                value={currentUser.phone}
                onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                className='border-2 rounded-2xl  border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
            </div>
            <div className='flex flex-col'>
              <label
                className='text-xl font-bold text-white'
                htmlFor="totalBeds">Enter email :</label>
              <input
                type="email"
                id="totalBeds"
                value={currentUser.user.email}
                onChange={(e) => setCurrentUser({ ...currentUser, user: { ...currentUser.user, email: e.target.value } })}
                name="availableBeds"
                className='border-2 rounded-2xl  border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
            </div>
            <button className='bg-yellow-600 text-green-950 px-5 py-3 font-extrabold rounded-2xl'>Update</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default UserUpdateDetails