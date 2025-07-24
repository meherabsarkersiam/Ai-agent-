import React, { useState } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Usermenu = ({ data, isusermenu, setisusermenu }) => {
  const [userid, setuserid] = useState("");
  const [curuserid, setcuruserid] = useState("");

  const navigate = useNavigate();
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
  const adduser = async () => {
    try {
      const response = await axios.put(`/project/adduser/${data._id}`, {
        adduserid: [userid],
      });

      // success হলে usermenu বন্ধ করে navigate করো
      setisusermenu(false);
      setuserid("");

      // পুরা reload না দিয়ে শুধু data refresh করার চেষ্টা করো
      navigate(0); // বা navigate(`/project/${data._id}`) আবার render করাতে
    } catch (error) {
      // Error message দেখাও (server message থাকলে সেটা)
      alert(error.response?.data?.message || "Failed to add user");
      setuserid("");
    }
  };

  const deleteuser = async (id) => {
    try {
      const response = await axios.put(`/project/deleteuser/${data._id}`, {
        deleteuserid: id,
      });
      navigate(0);
    } catch (error) {
      alert(error.response?.data?.message || "Failed fsv to delete user");
    }
  };

  return (
    <div
      className={
        isusermenu
          ? `absolute max-h-[450px] min-h-[400px] z-40 min-w-[300px] bg-zinc-900 rounded-md p-2 flex flex-col justify-between`
          : `hidden`
      }
    >
      <div>
        <h1 className="text-white text-xl font-bold flex justify-between items-center">
          <span>users:</span>
          <i
            onClick={() => {
              setisusermenu(false);
            }}
            className="ri-close-large-fill cursor-pointer"
          ></i>
        </h1>
        <div className="w-full h-[2px] bg-zinc-600 mt-1"></div>
      </div>
      <div className="w-full h-[350px] bg-zinc-500 mt-1 rounded-xl p-2">
        <div className="w-full h-[50px] bg-zinc-800 py-1 mt-1 rounded-xl flex items-center justify-between px-2 border-t-2 border-white">
          <h1 className="text-white text-small font-bold">
            cr:{" "}
            <span className="text-[#863792] text-[15px]">{data.creator}</span>
          </h1>
        </div>

        {data.userdetails.map((user) => {
          return (
            <div
              key={user}
              className="w-full h-[50px] bg-zinc-800 py-1 mt-1 rounded-xl flex items-center justify-between px-2 border-t-2 border-white"
            >
              <h1 className="text-white text-lg font-bold">
                us:<span className="text-[#863792] text-[15px]">{user}</span>
              </h1>
              {data.creator === curuserid && (
                <i 
                 title="Remove user from project"
                onClick={()=>deleteuser(user)}
                className="ri-delete-bin-6-line text-white cursor-pointer"></i>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="text"
          className="w-full h-[30px]  mt-1 rounded-md p-2 text-white outline-none border-1 border-white"
          placeholder="enter user id to add.."
          value={userid}
          onChange={(e) => setuserid(e.target.value)}
        />
        <button
          className={`w-full h-[30px] bg-blue-300 mt-1 rounded-2xl   ${
            userid ? "cursor-pointer bg-blue-500" : "cursor-not-allowed"
          } `}
          disabled={!userid}
          onClick={() => {
            adduser();
          }}
        >
          {" "}
          Add user
        </button>
      </div>
    </div>
  );
};

export default Usermenu;
