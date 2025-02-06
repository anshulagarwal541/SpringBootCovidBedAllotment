import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../helpers/AuthContext';
import axios from 'axios';
import { HospitalBackground } from '../../../../public';
import StatCard from '../../../components/Hospital/StatCard';

function HospitalHome() {
    const {
        id,
        url,
        error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType,
        hospital, setHospital
    } = useContext(AuthContext);
    const [hospitalBookings, setHospitalBookings] = useState([]);

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
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data);
        })

        axios.get(`${url}/admin/hospital/${id}/bookings`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("adminAccessToken")}`
            }
        }).then((response) => {
            if (!response.data.error) {
                setHospitalBookings(response.data);
            }
        }).catch((e) => {
            setError(true)
            console.log(e)
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data)
            setErrorType("error")
        })
    }, [])

    return (
        <div className='min-h-lvh'>
            {hospital && (
                <div className='w-full h-full'>
                    <div
                        className='relative w-full h-[100vh]'
                        style={{
                            backgroundImage: `url(${HospitalBackground})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <div
                            className='absolute backdrop-brightness-50 w-full h-full flex justify-center flex-col gap-5 items-center'
                        >
                            <p className='text-yellow-400 font-extrabold text-5xl'>
                                {hospital.name}
                            </p>
                            <p className='text-white text-xl font-bold'>{hospital.address}</p>
                        </div>
                    </div>
                    <div className=' flex flex-col gap-2 justify-center items-center p-10 border-4 border-green-950'>
                        <p className='text-green-950 font-extrabold text-4xl text-center'>States</p>
                        <div className='flex gap-5 justify-center items-center'>
                            <StatCard text={hospital.totalBeds} name="Total Beds" />
                            <StatCard text={hospital.availableBeds} name="Available Beds" />
                            <StatCard text={hospitalBookings.length} name="Bookings" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HospitalHome