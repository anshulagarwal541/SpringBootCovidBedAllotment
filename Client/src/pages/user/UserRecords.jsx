import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../helpers/AuthContext'
import { useNavigate } from 'react-router-dom';
import { Box, Rating } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import PreviewIcon from '@mui/icons-material/Preview';
import StarIcon from '@mui/icons-material/Star';

function UserRecords() {
    const {
        url,
        error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType
    } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${url}/user/booking/record`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("userAccessToken")}`
            }
        }).then((response) => {
            getRow(response.data);
        }).catch((e) => {
            setError(true)
            setErrorType("error")
            setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data)
        })
    }, [])

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 150,
        },
        {
            field: 'user',
            headerName: 'User',
            width: 150
        },
        {
            field: 'hospitalName',
            headerName: 'Hospital',
            width: 150
        },
        {
            field: 'hospitalRating',
            headerName: 'Hospital Rating',
            width: 150,
            renderCell: (params) => (
                <div>
                    <Rating
                        name="text-feedback"
                        value={params.row.hospitalRating}
                        sx={{ color: "red" }}
                        readOnly
                        precision={0.5}
                        emptyIcon={<StarIcon style={{ opacity: 1, color: "white" }} fontSize="inherit" />}
                    />
                </div>
            )
        },
        {
            field: 'hospitalAddress',
            headerName: 'Address',
            width: 250
        },
        {
            field: 'bookedBeds',
            headerName: 'Beds',
            width: 150,
        },
        {
            field: 'cost',
            headerName: 'Cost',
            width: 150
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150
        }
    ];

    const getRow = (response) => {
        const allRows = [];
        response.map((h) => {
            allRows.push({
                id: h.id,
                user: h.userInfo.name,
                hospitalName: h.hospital.name,
                hospitalAddress: h.hospital.address,
                bookedBeds: h.beds,
                hospitalRating: h.hospital.totalRating,
                status: h.status,
                bookedDate: h.bookedDate,
                cost: h.totalCost
            })
        })
        setBookings(allRows)
    }

    return (
        <div className='flex justify-center items-center min-h-lvh flex-col gap-5'>
            <p className='text-green-950 font-extrabold text-3xl'>History Book</p>
            <div className='border-4 rounded-2xl border-green-950 h-fit w-[70%]'>

                <Box sx={{ height: 400, width: '100%', borderRadius: "16px" }}>
                    <DataGrid
                        rows={bookings}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        sx={{
                            padding: "10px",
                            borderRadius: "16px",
                            color: "#052e16",
                            fontWeight: "700",
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#052e16',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold',
                                color: '#052e16'
                            },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                    />
                </Box>
            </div>
        </div>
    )
}

export default UserRecords