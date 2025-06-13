import React, { useEffect } from 'react'
import "./index.css"
import Navbar from './components/Navbar'
import {BrowserRouter as Router,Routes,Route, Navigate} from "react-router-dom"
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/useAuthStore.js'
import {Loader} from "lucide-react"
import {Toaster} from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore.js'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore()

  const {theme}=useThemeStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  console.log({authUser})
 
 /**checkAuth() will be called when the app loads, and it’ll:
hit the backend (/auth/check)
update authUser
and set isCheckingAuth to false
 */
  // display loading icon while it checkauth
  if(isCheckingAuth && !authUser)return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin'/>
    </div>
  )

/*When checkAuth() is called in the frontend:
const res = await axiosInstance.get("/auth/check");
set({ authUser: res.data });
This does two things:
Sends a GET request to your backend at /auth/check.
If the user is authenticated (valid token or cookie), the backend responds with user data, and authUser gets updated with that data. */

  return (
    <div data-theme={theme}>
<Router>
    <Navbar />
    <Routes>
     <Route path='/' element={authUser?<HomePage />:<Navigate to="/login" />} />  {/*if authenitcated homepage or else to loginpage in a way prtoecting th home page*/}
        <Route path='/signup' element={!authUser?<SignUpPage />:<Navigate to="/" />} />
        <Route path='/login' element={!authUser?<LoginPage />:<Navigate to="/" />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser?<ProfilePage />:<Navigate to="/login" />} /> {/*protecting profile page..we want only logged in user here */}
      </Routes>
  </Router>

  <Toaster />

    </ div>
  )
}

export default App