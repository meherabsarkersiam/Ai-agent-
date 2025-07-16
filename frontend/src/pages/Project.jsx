import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import IndivualProject from "../components/IndivualProject";


const Project = () => {
    const [response, setresponse] = useState()
  const navigate = useNavigate();
  useEffect(() => {
      const fetchProjects = async () => {
          const response = await axios.get("/project/getprojects");
          console.log(response.data);
          
          setresponse(response.data)
          
      }
      fetchProjects()
  },[])

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-20 gap-20">
      <div>
        <button
          onClick={(e) => {
            e.preventDefault(), navigate("/newproject");
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition text-2xl cursor-pointer"
        >
          New Project <i className="ri-link"></i>
        </button>
      </div>
      <div>
      {response?.map((project) => {
          return (
              <IndivualProject project={project} key={project._id}/>
          )
      })}
      </div>
    </div>
  );
};

export default Project;
