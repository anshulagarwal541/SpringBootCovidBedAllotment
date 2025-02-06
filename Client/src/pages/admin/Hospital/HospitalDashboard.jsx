import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../helpers/AuthContext';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';
import { Alert, Snackbar } from '@mui/material';
import HospitalNavBar from './HospitalNavbar';

function HospitalDashboard({ children }) {
    const { id, url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);
    const [hospital, setHospital] = useState(null);

    const handleClose = (event, reason) => {
        setError(false)
        setErrorMessage(null)
        setErrorType(null)
    };

    return (
        <AuthContext.Provider value={{
            id, url, error, setError,
            errorMessage, setErrorMessage,
            errorType, setErrorType,
            hospital, setHospital
        }}>
            {error && (
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={error}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    key={"top" + "center"}
                >
                    <Alert
                        severity={errorType}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>
            )}
            <div className='min-h-lvh'>
                <HospitalNavBar />
                <div className='min-h-lvh'>
                    {children}
                </div>
                <Footer />
            </div>
        </AuthContext.Provider>
    )
}

export default HospitalDashboard