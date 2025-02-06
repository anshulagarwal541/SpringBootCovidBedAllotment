import React, { useContext } from 'react'
import { AuthContext } from '../../helpers/AuthContext';
import { Alert, Snackbar } from '@mui/material';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

function UserDashboard({ children }) {
    const { url, error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType } = useContext(AuthContext);

    const handleClose = () => {
        setError(false)
        setErrorType(null)
        setErrorMessage(null)
    }

    return (
        <AuthContext.Provider
            value={{
                url,
                error, setError,
                errorMessage, setErrorMessage,
                errorType, setErrorType
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
            <div className='min-h-[100vh]'>
                <NavBar />
                <div className='min-h-[100vh]'>
                    {children}
                </div>
                <Footer />
            </div>
        </AuthContext.Provider>
    )
}

export default UserDashboard