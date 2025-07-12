import React, { useState } from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useSelector } from 'react-redux'
import Logout from '../components/Logout'

const Authpage = () => {
    const [signup, setsignup] = useState(false)
   const isauthenticated = useSelector((state) => state.auth.isauthenticated)
  return (
    <div>
      {isauthenticated?<Logout/>:signup? <Signup setsignup={setsignup}/>:<Login setsignup={setsignup}/>} 
     
    </div>
  )
}

export default Authpage
