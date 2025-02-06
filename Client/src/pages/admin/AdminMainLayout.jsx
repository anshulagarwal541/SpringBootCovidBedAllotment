import React, { useContext } from 'react'
import { AuthContext } from '../../helpers/AuthContext'
import AdminDashboard from './AdminDashboard'
import { Outlet } from 'react-router-dom'

function AdminMainLayout() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    return (
        <AuthContext.Provider value={{
            url,
            error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType
        }}>
            <AdminDashboard>
                <Outlet />
            </AdminDashboard>
        </AuthContext.Provider>
    )
}

export default AdminMainLayout