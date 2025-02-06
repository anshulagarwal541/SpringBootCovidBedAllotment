import React, { useContext } from 'react'
import { AuthContext } from '../../helpers/AuthContext'
import UserDashboard from './UserDashboard'
import { Outlet } from 'react-router-dom';

function UserMainLayout() {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    return (
        <AuthContext.Provider
            value={{
                url,
                error, setError,
                errorMessage, setErrorMessage,
                errorType, setErrorType
            }}
        >
            <UserDashboard>
                <Outlet />
            </UserDashboard>
        </AuthContext.Provider>
    )
}

export default UserMainLayout