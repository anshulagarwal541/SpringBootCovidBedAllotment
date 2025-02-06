import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Tooltip } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminAllHospitals() {
    const { url, setError, setErrorMessage, setErrorType } = useContext(AuthContext);
    const [hospitals, setHospitals] = useState([]);
    const navigate=useNavigate();

    useEffect(() => {
        axios.get(`${url}/admin/allHospitals`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("adminAccessToken")}`
            }
        }).then((response) => {
            getRow(response.data);
        })
    }, [])

    const columns = [
        { field: 'id', headerName: 'ID', width: 150, },
        {
            field: 'name',
            headerName: 'Name',
            width: 150
        },
        {
            field:'address',
            headerName: 'Address',
            width:250
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 150,
        },
        {
            field: 'totalBeds',
            headerName: 'Total Beds',
            width: 150
        },
        {
            field: 'availableBeds',
            headerName: 'Availability',
            width: 150
        },
        {
            headerName: 'View',
            width: 150,
            renderCell: (params) => (
                <button onClick={()=>handleView(params.row)}><PreviewIcon /></button>
            )
        }
    ];

    const handleView = (row) => {
        navigate(`/admin/hospital/${row.id}`)

    }

    const getRow = (response) => {
        const allRows = [];
        response.map((h) => {
            allRows.push({
                id: h.id,
                name: h.name,
                address: h.address,
                totalBeds: h.totalBeds,
                availableBeds: h.availableBeds,
                phone: h.phone
            })
        })
        setHospitals(allRows)
    }

    return (
        <div className='flex justify-center items-center min-h-lvh flex-col gap-5'>
            <p className='text-green-950 font-extrabold text-3xl'>Hospitals</p>
            <div className='border-4 rounded-2xl border-green-950 h-fit w-[70%]'>

                <Box sx={{ height: 400, width: '100%', borderRadius: "16px" }}>
                    <DataGrid
                        rows={hospitals}
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

export default AdminAllHospitals