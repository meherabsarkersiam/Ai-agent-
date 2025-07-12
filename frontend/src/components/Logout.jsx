import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authslice.js'
import axios from '../config/axios.js'

const Logout = () => {
const dispatch=  useDispatch()
  const handleLogout = async(e) => {
    e.preventDefault()
    const response = await axios.post('/api/auth/logout')
    dispatch(logout())
    console.log(response);
    
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-900">
      <div className="bg-zinc-300 p-6 rounded shadow-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Are you sure you want to logout?</h2>
        <button
          onClick={(e)=>{handleLogout(e)}}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Logout