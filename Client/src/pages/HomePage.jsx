import React, { useContext } from 'react'
import NavBar from '../components/NavBar'
import { background } from '../../public'
import Footer from '../components/Footer'
import { Alert, Snackbar } from '@mui/material'
import { AuthContext } from '../helpers/AuthContext'

function HomePage() {
  const {
    error, setError,
    errorMessage, setErrorMessage,
    errorType, setErrorType
  } = useContext(AuthContext);

  const handleClose = () => {
    setError(false)
    setErrorMessage(null)
    setErrorType(null)
  };

  return (
    <div className='min-h-screen w-full flex flex-col'>
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
      <NavBar />
      <div
        className='relative h-[100vh]'
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div
          className='absolute h-[100vh] w-full backdrop-brightness-50 flex justify-center items-center'
        >
          <div className='text-center'>
            <p className='text-yellow-400 py-2 font-extrabold text-4xl'>Covid Beds Allotment System</p>
            <p className='text-yellow-400 font-bold text-2xl'>Welcome to <span className='text-green-500'>CovidBeds</span></p>
            <p className='text-white text-xl font-bold py-2'>Here you can browse the registered hospitals and book suitable bed online. We wish everyone a speedy recovery....</p>
            <p className='text-white font-bold text-2xl'>Go to <span className='text-green-500'>MENU</span></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomePage