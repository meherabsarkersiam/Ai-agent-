import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

const Project = ({ project }) => {
  const nevigate = useNavigate();
  const [curuserid, setcuruserid] = useState('')

 useEffect(() => {
    const getcurrentuserid = async () => {
      try {
        const response = await axios.get("/profile/getcurrentuserid");
        setcuruserid(response.data);
      } catch (error) {
        alert(error?.data?.message || "request Failed");
      }
    };
    getcurrentuserid();
  }, []);


  const deleteProject = async (e) => {
    e.preventDefault();
    const response = await axios.delete(`/project/delete/${project._id}`);
    if (response.status === 200) {
      alert("project deleted successfully");
      window.location.reload();
    }
  };

  return (
    <div className="bg-zinc-200 rounded-md shadow p-4 flex flex-col gap-4 min-w-[500px]">
      <div className="font-bold text-xl border-b pb-2 flex justify-between">
       <h1> name: {project.Projectname}</h1>
       <h1
        title={curuserid === project.creator? "you can perform everything":"yau can only add user and can perticipate in project"}
       >role: {curuserid === project.creator? "creator and admin":"user"}</h1>
      </div>

      <div className="flex justify-between">
        <h1 className="text-1xl font-bold flex gap-5">
          user: {project.users.length}
        
        </h1>
          <h1>
          {project.creator === curuserid &&           <i
            onClick={(e) => {
              e.preventDefault(), deleteProject(e)
            }}
            className="ri-delete-bin-6-line text-2xl cursor-pointer"
          ></i>}
        </h1>
        <h1>
          <i
            onClick={(e) => {
              e.preventDefault(), nevigate(`/project/${project._id}`);
            }}
            className="ri-arrow-right-circle-line text-2xl cursor-pointer"
          ></i>
        </h1>
      </div>
    </div>
  );
};

export default Project;
