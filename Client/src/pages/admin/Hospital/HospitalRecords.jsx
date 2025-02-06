import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../helpers/AuthContext';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function HospitalRecords() {
  const {
    id,
    url,
    error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType,
    hospital, setHospital
  } = useContext(AuthContext);
  const [currentBookings, setCurrentBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${url}/admin/hospital/${id}/bookings`, {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("adminAccessToken")}`
      }
    }).then((response) => {
      getRow(response.data);
    })
  }, [])

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150
    },
    {
      field: 'userName',
      headerName: 'Customer',
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
    },
    {
      field: 'beds',
      headerName: 'Beds',
      width: 150
    },
    {
      field: 'totalCost',
      headerName: 'Paid',
      width: 150
    }
  ];

  const getRow = (response) => {
    let allRows = [];
    response.map((booking) => {
      allRows.push({
        id: booking.id,
        date: booking.bookedDate,
        userName: booking.userInfo.name,
        status: booking.status,
        beds: booking.beds,
        totalCost: booking.totalCost
      })
    })
    allRows=allRows.filter((row)=>row.status==="COMPLETED")
    setCurrentBookings(allRows)
  }

  const handleView = (row) => {
    navigate(`/admin/hospital/${row.id}`)

  }

  return (
    <div className='flex justify-center items-center min-h-lvh flex-col gap-5'>
      <p className='text-green-950 font-extrabold text-3xl'>Booking Records</p>
      <div className='border-4 rounded-2xl border-green-950 h-fit w-[70%]'>

        <Box sx={{ height: 400, width: '100%', borderRadius: "16px" }}>
          <DataGrid
            rows={currentBookings}
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

export default HospitalRecords