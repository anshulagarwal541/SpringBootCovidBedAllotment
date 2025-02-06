import React, { useContext } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { AuthContext } from '../../../helpers/AuthContext';
import HospitalDashboard from './HospitalDashboard';

function HospitalMainLayout() {
    const { id } = useParams();
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType}=useContext(AuthContext);

    return (
        <AuthContext.Provider value={{
            id, url, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType
        }}>
            <HospitalDashboard>
                <Outlet />
            </HospitalDashboard>
        </AuthContext.Provider>
    )
}

export default HospitalMainLayout