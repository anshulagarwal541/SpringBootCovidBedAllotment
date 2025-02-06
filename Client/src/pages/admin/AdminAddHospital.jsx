import React, { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext';

function AdminAddHospital() {
    const { url, setError, setErrorMessage, setErrorType } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get("name"),
            address: formData.get('address'),
            totalBeds: formData.get("totalBeds"),
            bedCost: formData.get("bedCost"),
            availableBeds: formData.get("totalBeds"),
            phone: formData.get("phone")
        }
        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${data.address}&apiKey=3b2d887ed6174074818fb94898b584f7`, { method: 'GET' });
        const result = await response.json();
        if (result.features && result.features.length > 0) {
            data.latitude = result.features[0].geometry.coordinates[1]; // Note: latitude is the second coordinate
            data.longitude = result.features[0].geometry.coordinates[0];
        } else {
            data.latitude = 0.0;
            data.longitude = 4.5;
        }
        axios.post(`${url}/admin/addHospital`, data, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("adminAccessToken")}`
            }
        }).then((response) => {
            setError(true)
            setErrorType("success")
            setErrorMessage("Successfully added the hospital.")
        }).catch((e) => {
            setError(true)
            setErrorType("error")
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data);
        })
        e.target.reset();
    }

    return (
        <div className='flex justify-center items-center min-h-[100vh] flex-col gap-5 py-10'>
            <p className='text-green-950 font-extrabold text-3xl py-10'>Add Hospital</p>
            <div className='w-full h-auto flex justify-center items-center'>
                <form onSubmit={handleSubmit} action="POST" className='bg-green-950 border-4 w-[70%] border-yellow-600 rounded-2xl p-10 flex flex-col gap-5'>
                    <div className='flex flex-col'>
                        <label
                            className='text-xl font-bold text-white'
                            htmlFor="name">Enter Hospital Name :</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
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
                            className='border-2 rounded-2xl  border-yellow-600 px-5 py-3 text-green-950 font-extrabold' />
                    </div>
                    <div className='flex flex-col'>
                        <label
                            className='text-xl font-bold text-white'
                            htmlFor="totalBeds">Enter Total Beds :</label>
                        <input
                            type="number"
                            id="totalBeds"
                            name="totalBeds"
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
                            className='border-2 rounded-2xl border-yellow-400 px-5 py-3 text-green-950 font-extrabold' />
                    </div>
                    <button className='bg-yellow-600 text-green-950 px-5 py-3 font-extrabold'>Add Hospital</button>
                </form>
            </div>
        </div>
    )
}

export default AdminAddHospital