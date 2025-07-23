import React from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="fixed w-full min-h-screen flex  items-center justify-center">
      <div className="main flex lg:flex-row flex-col justify-between w-[70%]">
        <div className="lg:w-[50%] w-full flex flex-col justify-center items-start lg:gap-5 gap-10">
          <h1 className="text-white text-6xl font-bold">
            A place for meaningful conversations with your project
          </h1>
          <h1 className="text-white text-2xl">
            It helps you connect with your Working friends and bosses, build
            your community and deepen your project knowledge.
          </h1>
          <Link
            to="/auth"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition text-2xl cursor-pointer"
          >
            Get Started <i className="ri-link"></i>
          </Link>
        </div>
        <div className="w-[50%] flex flex-col justify-center items-center">
          sjkbnvckjsdvbn
        </div>
      </div>
    </div>
  );
};

export default Homepage;
