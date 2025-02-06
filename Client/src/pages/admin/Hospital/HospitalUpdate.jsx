import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../../helpers/AuthContext';

function HospitalUpdate() {
  const {
    id,
    url,
    error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType,
    hospital, setHospital
  } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`${url}/admin/hospital/${id}`, {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("adminAccessToken")}`
      }
    }).then((response) => {
      setHospital(response.data);
    }).catch((e) => {
      setError(true)
      setErrorType("error")
      setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data)
    })
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hospital.address != "") {
      const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${hospital.address}&apiKey=3b2d887ed6174074818fb94898b584f7`, { method: 'GET' });
      const result = await response.json();
      if (result.features && result.features.length > 0) {
        hospital.latitude = result.features[0].geometry.coordinates[1]; // Note: latitude is the second coordinate
        hospital.longitude = result.features[0].geometry.coordinates[0];
      } else {
        setError(true)
        setErrorType("error")
        setErrorMessage("Can't find the entered address")
        return;
      }
    }
    axios.put(`${url}/admin/hospital/${id}`, hospital, {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("adminAccessToken")}`
      }
    }).then((response) => {
      setError(true)
      setErrorType("success")
      setErrorMessage(response.data);
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
        {hospital && (
          <form onSubmit={handleSubmit} action="POST" className='bg-green-950 border-4 w-[70%] border-yellow-600 rounded-2xl p-10 flex flex-col gap-5'>
            <div className='flex flex-col'>
              <label
                className='text-xl font-bold text-white'
                htmlFor="name">Enter Hospital Name :</label>
              <input
                type="text"
                id="name"
                name="name"
                value={hospital.name}
                onChange={(e) => setHospital({ ...hospital, name: e.target.value })}
                className='border-2 rounded-2xl border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
            </div>
            <div className='flex flex-col'>
              <label
                className='text-xl font-bold text-white'
                htmlFor="address">Enter Hospital Address :</label>
              <input
                type="text"
                id="address"
                name="address"
                value={hospital.address}
                onChange={(e) => setHospital({ ...hospital, address: e.target.value })}
                className='border-2 rounded-2xl  border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
            </div>
            <div className='flex flex-col'>
              <label
                className='text-xl font-bold text-white'
                htmlFor="totalBeds">Enter Total Beds :</label>
              <input
                type="number"
                id="totalBeds"
                value={hospital.availableBeds}
                onChange={(e) => setHospital({ ...hospital, availableBeds: e.target.value })}
                name="availableBeds"
                className='border-2 rounded-2xl  border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
            </div>
            <div className='flex flex-col'>
              <label
                className='text-xl font-bold text-white'
                htmlFor="bedCost">Enter Bed Cost :</label>
              <input
                type="number"
                id="bedCost"
                name="bedCost"
                value={hospital.bedCost}
                onChange={(e) => setHospital({ ...hospital, bedCost: e.target.value })}
                className='border-2 rounded-2xl  border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
            </div>
            <div className='flex flex-col'>
              <label
                className='text-xl font-bold text-white'
                htmlFor="phone">Enter Phone :</label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={hospital.phone}
                onChange={(e) => setHospital({ ...hospital, phone: e.target.value })}
                className='border-2 rounded-2xl border-yellow-400 px-5 py-3 text-green-950 font-extrabold' />
            </div>
            <button className='bg-yellow-600 text-green-950 px-5 py-3 font-extrabold rounded-2xl'>Update</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default HospitalUpdate