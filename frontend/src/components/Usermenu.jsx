import React from "react";

const Usermenu = ({ data , isusermenu , setisusermenu }) => {
  return (
    <div className={isusermenu ? `absolute max-h-[450px] min-h-[400px] z-40 min-w-[300px] bg-zinc-900 rounded-md p-2 flex flex-col justify-between` : `hidden`}>
      <div>
        <h1 className="text-white text-xl font-bold flex justify-between items-center"><span>users:</span> 
        <i 
        onClick={()=>{setisusermenu(false)}}
        className="ri-close-large-fill cursor-pointer"></i></h1>
        <div className="w-full h-[2px] bg-zinc-600 mt-1"></div>
      </div>
      <div className="w-full h-[350px] bg-zinc-500 mt-1 rounded-xl p-2">
        <div className="w-full h-[50px] bg-zinc-800 py-1 mt-1 rounded-xl flex items-center justify-between px-2 border-t-2 border-white">
          <h1 className="text-white text-small font-bold">cr: <span className="text-[#863792] text-[15px]">{data.creator}</span></h1>
      
        </div>
        
        
        {data.userdetails.map((user) => {
          return (
            <div className="w-full h-[50px] bg-zinc-800 py-1 mt-1 rounded-xl flex items-center justify-between px-2 border-t-2 border-white">
              <h1 className="text-white text-lg font-bold">us:<span className="text-[#863792] text-[15px]">{user}</span></h1>
              <i className="ri-delete-bin-6-line text-white"></i>
            </div>
          );
        })}
      </div>
      <button className="w-full h-[30px] bg-blue-500 mt-1 rounded-2xl cursor-pointer">
        {" "}
        Add user
      </button>
    </div>
  );
};

export default Usermenu;
