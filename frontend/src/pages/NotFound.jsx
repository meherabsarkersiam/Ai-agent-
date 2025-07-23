import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className=" absolute h-screen w-full flex flex-col items-center justify-center z-40 bg-transparent text-white text-center backdrop-blur-sm px-4">
      <h1 className="text-8xl font-extrabold tracking-widest animate-fadeIn">404</h1>
      <p className="text-lg mt-4 max-w-xl animate-fadeIn delay-200">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button
        className="mt-8 px-6 py-2 border border-white rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 animate-fadeIn delay-100 cursor-pointer"
        onClick={() => navigate("/")}
      >
        ⬅ Go Home
      </button>
    </div>
  );
};

export default NotFound;