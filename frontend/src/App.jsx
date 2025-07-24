import React, { useEffect } from 'react'
import Authpage from './pages/Authpage'
import { Route, Routes } from 'react-router-dom'
import axios from '../src/config/axios.js'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from './redux/slices/authslice.js'
import Homepage from './pages/Homepage.jsx'
import Createproject from './pages/Createproject.jsx'
import NotFound from './pages/NotFound.jsx'
import Navber from './components/Navber.jsx'
import Project from './pages/Project.jsx'
import Profile from './pages/Profile.jsx'
import Underproject from './components/Underproject.jsx'


const App = () => {
  const isauthenticated = useSelector((state) => state.auth.isauthenticated)
const dispatch=useDispatch()
  useEffect(() => {
    const checkAuth=async()=>{
   const response = await axios.get('/')
   try {
    if(response.data.user){
       dispatch(login(response.data.user))
    
       
       
       
    }else{
      dispatch(logout())
    }
   
   } catch (error) {
alert(error)
    
   }
}
checkAuth()
  }, [])
  
  return (
    <div className='min-h-screen w-full bg-zinc-900'>
      <Navber/>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/auth' element={<Authpage/>}/>
       {isauthenticated && <Route path='/project/create' element={<Createproject/>}/>}
       {isauthenticated && <Route path='/project' element={<Project/>}/>}
       {isauthenticated && <Route path='/profile' element={<Profile/>}/>}
       <Route path='/project/:projectid' element={<Underproject/>}/>
       <Route path='*' element={<NotFound/>}/>
      </Routes>
      
    </div>
  )
}

export default App
