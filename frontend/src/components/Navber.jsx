import React from 'react'
import logo from '../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Navber = () => {
const nevigate = useNavigate();
const isauthenticated = useSelector((state) => state.auth.isauthenticated);
  return (
    <div className="fixed w-full lg:px-[12vw] mt-[2vh] z-10">
       <nav>
        <div className="w-full h-[65px] bg-transparent border-1 border-zinc-600 rounded-2xl flex justify-between lg:px-20 px-5">
         <div className="relative flex items-center ">
          <img className="h-[45px] cursor-pointer"
          onClick={(e)=>{nevigate('/')}}
          src={logo} alt="" />
         </div>
         <div className="flex items-center">
          <ul className="flex items-center gap-8 text-white text-2xl ">
            <li className="cursor-pointer">
              <Link to="/">Home</Link>
            </li>
           {isauthenticated&& <li className="cursor-pointer">
              <Link to="/project">Projects</Link>
            </li>}
            {isauthenticated && <li className="cursor-pointer">
              <Link to="/profile">Profile</Link>
            </li>}
            {!isauthenticated && <li className="cursor-pointer">
              <Link to="/auth">Login</Link>
            </li>}
            {isauthenticated && <li className="cursor-pointer">
              <Link to="/auth">Logout</Link>
            </li>}
          </ul>
         </div>
        </div>
      </nav>
    </div>
  )
}

export default Navber
