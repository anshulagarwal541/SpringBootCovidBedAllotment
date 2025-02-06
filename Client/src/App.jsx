import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { AuthContext } from "./helpers/AuthContext"
import HomePage from "./pages/HomePage"
import AdminMainLayout from "./pages/admin/AdminMainLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminAddHospital from "./pages/admin/AdminAddHospital"
import AdminAllHospitals from "./pages/admin/AdminAllHospitals"
import LoginPage from "./pages/admin/LoginPage"
import UserLogin from "./pages/user/UserLogin"
import UserRegister from "./pages/user/UserRegister"
import { useState } from "react"
import HospitalMainLayout from "./pages/admin/Hospital/HospitalMainLayout"
import HospitalHome from "./pages/admin/Hospital/HospitalHome"
import HospitalUpdate from "./pages/admin/Hospital/HospitalUpdate"
import HospitalCurrentBookings from "./pages/admin/Hospital/HospitalCurrentBookings"
import HospitalRecords from "./pages/admin/Hospital/HospitalRecords"
import AdminHomePage from "./pages/admin/AdminHomePage"
import UserMainLayout from "./pages/user/UserMainLayout"
import UserHomePage from "./pages/user/UserHomePage"
import UserUpdateDetails from "./pages/user/UserUpdateDetails"
import UserChangePassword from "./pages/user/UserChangePassword"
import UserBook from "./pages/user/UserBook"
import UserHospital from "./pages/user/Hospital/UserHospital"
import UserRecords from "./pages/user/UserRecords"

function App() {
  const url = import.meta.env.VITE_URL;
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        url,
        error, setError,
        errorMessage, setErrorMessage,
        errorType, setErrorType
      }}>
      <Router>
        <Routes>


          // home route...
          <Route path="/" element={<HomePage />} />


          // User routes
          <Route path="/user" element={<UserMainLayout />}>
            <Route path="" element={<UserHomePage />} />
            <Route path="update/details" element={<UserUpdateDetails />} />
            <Route path="update/details/password" element={<UserChangePassword />} />
            <Route path="bed/book" element={<UserBook />} />
            <Route path="hospital/:id" element={<UserHospital />} />
            <Route path="records" element={<UserRecords />} />
          </Route>


          //   admin routes...
          <Route path="/admin" element={<AdminMainLayout />}>
            <Route path="" element={<AdminHomePage />} />
            <Route path="addHospital" element={<AdminAddHospital />} />
            <Route path="hospital/view" element={<AdminAllHospitals />} />
          </Route>


          // admin hospital route
          <Route path="/admin/hospital/:id" element={<HospitalMainLayout />}>
            <Route path="" element={<HospitalHome />} />
            <Route path="update" element={<HospitalUpdate />} />
            <Route path="booking/current" element={<HospitalCurrentBookings />} />
            <Route path="booking/records" element={<HospitalRecords />} />
          </Route>


          // admin login route...
          <Route path="/admin/login" element={<LoginPage />} />


          // user authentication routes....
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />


        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
