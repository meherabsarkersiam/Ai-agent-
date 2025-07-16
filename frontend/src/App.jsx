import React, { useEffect } from 'react'
import Authpage from './pages/Authpage'
import { Route, Routes } from 'react-router-dom'
import axios from '../src/config/axios.js'
import { useDispatch } from 'react-redux'
import { login, logout } from './redux/slices/authslice.js'
import Homepage from './pages/Homepage.jsx'
import Createproject from './pages/Createproject.jsx'

const App = () => {
const dispatch=useDispatch()
  useEffect(() => {
    const checkAuth=async()=>{
   const response = await axios.get('/')
   try {
    if(response.data.user){
       dispatch(login(response.data.user))
       console.log(response.data.user);
       
    }else{
      dispatch(logout())
    }
   
   } catch (error) {
    console.log(error);
    
   }
}
checkAuth()
  }, [])
  
  return (
    <div className='h-screen w-full bg-zinc-900'>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/auth' element={<Authpage/>}/>
        <Route path='/project/create' element={<Createproject/>}/>
      </Routes>
      
    </div>
  )
}

export default App
