import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../helpers/AuthContext';
import { Box } from '@mui/material';
import { DataGrid, renderActionsCell } from '@mui/x-data-grid';
import axios from 'axios';

function HospitalCurrentBookings() {
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
      if (!response.data.error) {
        getRow(response.data);
      }
    })
  }, [])

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150
    },
    {
      field: 'bookedDate',
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
      renderCell: (params) => {
        return (
          <select
            value={params.value}
            onChange={(e) => handleStatusChange(params.row.hospitalId, e.target.value, params.row.id)}
          >
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        );
      }
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
        bookedDate: booking.bookedDate,
        userName: booking.userInfo.name,
        status: booking.status,
        beds: booking.beds,
        totalCost: booking.totalCost,
        hospitalId: booking.hospital.id,
        hospital:booking.hospital,
        userInfo:booking.userInfo
      })
    })
    allRows = allRows.filter((row) => row.status === "ONGOING")
    setCurrentBookings(allRows)
  }

  const handleView = (row) => {
    navigate(`/admin/hospital/${row.id}`)
  }

  const handleStatusChange = (hospitalId, value, rowId) => {

    const booking = currentBookings.find((b)=>b.id===rowId);
    booking.status=value;
    axios.put(`${url}/admin/hospital/booking`, booking, {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("adminAccessToken")}`
      }
    }).then((response) => {
      if (!response.data.error) {
        getRow(response.data)
        setError(true)
        setErrorType("success")
        setErrorMessage("Updated the booking...");
      }
    }).catch((e) => {
      setError(true)
      setErrorType("error")
      setErrorMessage(e.response.data.error ? e.response.data.error : e.response.data);
    })
  }

  return (
    <div className='flex justify-center items-center min-h-lvh flex-col gap-5'>
      <p className='text-green-950 font-extrabold text-3xl'>Current Bookings</p>
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

export default HospitalCurrentBookings