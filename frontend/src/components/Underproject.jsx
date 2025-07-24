import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../config/axios";
import Usermenu from "./usermenu";

const Underproject = () => {
  const [isusermenu, setisusermenu] = useState(false);
  const [text, setText] = useState("");
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const textareaRef = useRef(null);
  const { projectid } = useParams();
  if (!projectid) {
    return <div>Project not founded</div>;
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = textarea.scrollHeight + "px"; // adjust to new content
    }
  }, [text]);

  //datafetch
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(`/project/getproject/${projectid}`);
        setdata(response.data.cleanproject);
      } catch (error) {
        setdata(null);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [projectid]);

  if (loading) return <div>Loading...</div>;
 
  if (!data) return <div>Project not founding</div>;

  return (
    <div className="min-h-screen min-w-full pt-[12vh] lg:pt-[9vw] px-[5vw] ">
      <div></div>
      <div
        className={
          isusermenu
            ? `absolute w-full h-screen top-0 left-0 bg-black/50  flex z-20 justify-center items-center`
            : `hidden`
        }
      >
        <div
          onClick={() => {
            setisusermenu(false);
          }}
          className={
            isusermenu
              ? `absolute w-full h-screen top-0 left-0 bg-black/50  flex z-20 justify-center items-center`
              : `hidden`
          }
        ></div>
        <Usermenu
          data={data}
          isusermenu={isusermenu}
          setisusermenu={setisusermenu}
        />
      </div>
      <div className=" flex border-2 border-zinc-600 rounded-2xl gap-10 lg:p-4 justify-between flex-col lg:flex-row ">
        <div className="message_section relative lg:min-w-[500px] min-h-[70vh] bg-zinc-600 rounded-2xl p-2 ">
          <div className=" relative w-full pt-2.5 pb-3 border-2 border-black text-xl rounded-2xl flex px-5 justify-between items-center">
            <h1 className="font-bold">
              <i className="ri-lightbulb-fill pr-2"></i>
              {data.Projectname}
            </h1>
            <i
              onClick={() => setisusermenu((prev) => !prev)}
              className="ri-user-settings-line font-bold cursor-pointer"
            ></i>
          </div>
          <div className="absolute bottom-2 w-[92%] flex items-center justify-between">
            <textarea
              ref={textareaRef}
              rows={1}
              className="  w-[87%] resize-none overflow-hidden p-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <i className="ri-send-plane-fill text-3xl cursor-pointer"></i>
          </div>
        </div>
        <div className="project_section  w-full lg:max-w-[75%]  h-[70vh] bg-zinc-700"></div>
      </div>
    </div>
  );
};

export default Underproject;
