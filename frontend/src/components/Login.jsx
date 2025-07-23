import React, { useState } from 'react'
import axios from '../config/axios.js'
import { useNavigate } from 'react-router-dom'

const Login = ({setsignup}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, seterr] = useState('')
 const nevigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await axios.post('/api/auth/login', { email, password })
    .then(()=>{
     
       setEmail('')
      setPassword('')
      window.location.reload()
      nevigate('/')
    })
    .catch((err)=>{
      seterr(err.response.data.message);
    })
   
  
  }

  return (
    <div className='h-screen w-full bg-zinc-900 flex justify-center items-center '>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 p-6 bg-zinc-300 rounded-md min-w-[350px]'
      >
        <h2 className='text-2xl font-bold text-center mb-2'>Login</h2>
        {err && <p className='text-red-500 text-center'>{err}!</p>}
        <input
          type='email'
          placeholder='Email'
          className='p-2 rounded border'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='p-2 rounded border'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition'
        >
          Login
        </button>
        <h1>Don't have an account <span onClick={()=>setsignup(true)} className='text-blue-500 cursor-pointer'>Register</span></h1>
      </form>
      
    </div>
  )
}

export default Login