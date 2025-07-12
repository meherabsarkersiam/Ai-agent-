import React, { useState } from 'react'
import axios from '../config/axios.js'

const Signup = ({setsignup}) => {
   const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setname] = useState('')
    const [err, seterr] = useState('')
  
    const handleSubmit = async (e) => {
      e.preventDefault()
    const response = await axios.post('api/auth/resister', { name,email, password })
     .then((response)=>{
      console.log(response)
      setEmail('')
      setPassword('')
      setname('')
     })
     .catch((err)=>{
      seterr(err.response?.data?.message || 'something went wrong');
      console.log(err.response?.data?.message || 'something went wrong');
      
     })
    }
  return (
 <div className='h-screen w-full bg-zinc-900 flex justify-center items-center '>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 p-6 bg-zinc-300 rounded-md min-w-[350px]'
      >
        <h2 className='text-2xl font-bold text-center mb-2'>Signup</h2>
        {err&& <p className='text-red-500 text-center'>{err}!</p>}
        <input
          type='text'
          placeholder='Name'
          className='p-2 rounded border'
          value={name}
          onChange={(e) => setname(e.target.value)}
          required
        />
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
          Signup
        </button>
        <h1>Already have an account <span onClick={()=>setsignup((prev)=>!prev)} className='text-blue-700 cursor-pointer'>Login</span></h1>
      </form>
      
    </div>
  )
}

export default Signup
