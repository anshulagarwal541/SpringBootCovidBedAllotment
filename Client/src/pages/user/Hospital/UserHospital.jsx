import React, { useContext, useEffect, useState } from 'react';
import { HospitalBackground } from '../../../../public';
import { AuthContext } from '../../../helpers/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import StatCard from '../../../components/Hospital/StatCard';
import { Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function UserHospital() {
    const { id } = useParams();
    const {
        url,
        error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType
    } = useContext(AuthContext);
    const [hospital, setHospital] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isBooking, setIsBooking] = useState(null);
    const [hospitalBookings, setHospitalBookings] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${url}/user/hospital/${id}`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
            }
        }).then((response) => {
            setHospital(response.data);
        }).catch((e) => {
            setError(true);
            setErrorType("error");
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data);
        });

        axios.get(`${url}/user/hospital/${id}/bookings`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
            }
        }).then((response) => {
            setHospitalBookings(response.data);
        }).catch((e) => {
            setError(true);
            setErrorType("error");
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data);
        });

        axios.get(`${url}/user/details`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
            }
        }).then((response) => {
            setUserInfo(response.data);
        }).catch((e) => {
            setError(true);
            setErrorType("error");
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data);
        });

    }, [id, url, setError, setErrorMessage, setErrorType]);

    const handleBooking = () => {
        const data = {
            userInfo: userInfo,
            hospital: hospital,
            beds: 1,
            totalCost: hospital.bedCost,
            bookedDate: (new Date()).toUTCString(),
        };
        axios.post(`${url}/user/booking`, data, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
            }
        }).then((response) => {
            setError(true);
            setErrorType("success");
            setErrorMessage(response.data)
            navigate("/user/bed/book");
        }).catch((e) => {
            setError(true);
            setErrorType("error");
            setErrorMessage(e.response.data.error);
        });
        setIsBooking(false);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            rating: formData.get("rating"),
            description: formData.get("description"),
            hospital: hospital,
            userInfo: userInfo
        }
        axios.post(`${url}/user/rate`, data, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
            }
        }).then((response) => {
            setError(true)
            setErrorType("success")
            setErrorMessage("Successfully added the review.")
            setHospital(response.data)
        }).catch((e) => {
            setError(true)
            setErrorType("error")
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data)
        })
        e.target.reset();
    }

    return (
        <div className='min-h-screen'>
            {hospital && (
                <div className='relative w-full h-full'>
                    <div
                        className='relative w-full h-[70vh] sm:h-[80vh] md:h-[100vh]'
                        style={{
                            backgroundImage: `url(${HospitalBackground})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <div className='absolute backdrop-brightness-50 w-full h-full flex justify-center flex-col gap-5 items-center px-4 text-center'>
                            <p className='text-yellow-400 font-extrabold text-3xl sm:text-4xl lg:text-5xl'>
                                {hospital.name}
                            </p>
                            <p className='text-white text-lg sm:text-xl font-bold'>{hospital.address}</p>
                            <div className='flex flex-col items-center bg-green-950 rounded-2xl px-4 py-3 border-2 border-yellow-400'>
                                <Rating
                                    name="text-feedback"
                                    value={hospital.totalRating}
                                    sx={{ color: "red" }}
                                    readOnly
                                    precision={0.5}
                                    emptyIcon={<StarIcon style={{ opacity: 1, color: "white" }} fontSize="inherit" />}
                                />
                                <p className='text-yellow-400 font-extrabold text-lg'>{hospital.totalRating} / 5.0</p>
                            </div>
                            <p className='max-w-[60%] text-white flex-wrap font-bold text-center'>
                                We pray for every patient to get better. In this pandemic, we pledge to give support to all needy people to get beds as soon as possible. We pledge to set a centralized system to prevent people from roaming around from one hospital to another in search of bed availability. Keep up hope and All The Best.
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 gap-6 lg:gap-10 border-t-4 border-green-950'>
                        <div className='flex flex-col gap-5'>
                            <p className='text-green-950 font-extrabold text-3xl sm:text-4xl text-center'>Stats</p>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-center'>
                                <StatCard text={hospital.totalBeds} name="Total Beds" />
                                <StatCard text={hospital.availableBeds} name="Available Beds" />
                                <StatCard text={hospital.bedCost} name="Cost Per Bed" />
                                <StatCard text={hospitalBookings && hospitalBookings.length} name="Bookings" />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <p className='text-green-950 font-extrabold text-3xl sm:text-4xl text-center'>Reviews</p>
                            <div className='flex flex-col gap-3 items-center bg-green-950 rounded-2xl px-10 py-4'>
                                <Rating
                                    name="text-feedback"
                                    value={hospital.totalRating}
                                    sx={{ color: "red" }}
                                    size="large"
                                    readOnly
                                    precision={0.5}
                                    emptyIcon={<StarIcon style={{ opacity: 1, color: "white" }} fontSize="inherit" />}
                                />
                                <p className='text-yellow-400 font-extrabold text-2xl'>{hospital.totalRating} / 5.0</p>
                                <button className='bg-white px-5 py-3 text-green-950 font-bold rounded-2xl'>See Reviews</button>
                            </div>
                        </div>
                        <div className='border-4 border-green-950 rounded-2xl p-4 sm:p-5 w-full max-w-lg'>
                            <form onSubmit={handleReviewSubmit} action="POST" className='text-green-950 flex flex-col gap-4'>
                                <div className='flex flex-col'>
                                    <label className='font-bold text-lg sm:text-xl' htmlFor="description">
                                        Enter Rating:
                                    </label>
                                    <Rating
                                        name="rating"
                                        defaultValue={0}
                                        max={5}
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <label className='font-bold text-lg sm:text-xl' htmlFor="description">
                                        Write Review:
                                    </label>
                                    <input
                                        name="description"
                                        id="description"
                                        type="text"
                                        className='border-2 rounded-2xl border-green-950 px-3 py-2'
                                    />
                                </div>
                                <button className='w-full bg-green-950 px-5 py-2 text-white font-bold rounded-2xl'>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className='bg-green-950 h-auto text-white font-bold p-5 flex justify-center items-center flex-col gap-10'>
                        <p className='text-center font-extrabold text-4xl'>Want to book ?</p>
                        <p className='max-w-[60%] flex-wrap font-bold text-center'>We pray for every patient to get better. In this pandemic, we pledge to give support to all needy people to get beds as soon as possible. We pledge to set a centralized system to prevent people from roaming around from one hospital to another in search of bed availability. Keep up hope and All The Best.</p>
                        <button onClick={() => setIsBooking(true)} className='bg-white text-green-950 font-extrabold px-5 py-2 rounded-2xl text-2xl'>Book</button>
                        <p className='font-bold text-center'><span className='font-extrabold'>Note</span> :- You can book only one bed at a time.</p>
                    </div>
                    {isBooking && (
                        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-3xl'>
                            <div className='brightness-100 bg-green-950 p-10 rounded-2xl flex flex-col gap-10 text-3xl'>
                                <button onClick={handleBooking} className='rounded-2xl bg-white text-green-950 font-extrabold px-10 py-4'>Confirm</button>
                                <button onClick={() => setIsBooking(false)} className='rounded-2xl bg-white text-green-950 font-extrabold px-10 py-4'>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserHospital;
