import Markdown from 'markdown-to-jsx'
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../config/axios";
import Usermenu from "./usermenu";
import { useSelector } from "react-redux";
import {
  initialSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket.config";

const Underproject = () => {
  const [isusermenu, setisusermenu] = useState(false);
  const [massage, setmassage] = useState("");
  const [messages, setMessages] = useState([]); // <-- new state for messages
  const [filetree, setfiletree] = useState(
    {
     
    }
  )
  const [openedfiles, setopenedfiles] = useState([])
  const [currentfile, setcurrentfile] = useState(null)

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
  }, [massage]);

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

  useEffect(() => {
    const socket = initialSocket(projectid);

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, [projectid]);

 useEffect(() => {
  receiveMessage("message", (data) => {
    
    let msg = data.message;

    if (data.sender === "AI") {
      if (msg.startsWith("```json")) {
        msg = msg.replace(/^```json\s*/, "").replace(/```$/, "");
        
      }
    }

    try {
      const parsed = JSON.parse(msg);
      console.log(parsed);
      if(parsed?.fileTree) {
        setfiletree(parsed?.fileTree)
        console.log(parsed?.fileTree);
        
      }
      const inmassage = parsed.text;
      appendmassage({ inmassage, sender: data.sender });
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      appendmassage({ inmassage: msg, sender: data.sender }); // fallback for broken JSON
    }
  });
}, []);


  if (loading) return <div>Loading...</div>;

  if (!data) return <div>Project not founding</div>;

  const sendmassage = async (e) => {
    e.preventDefault();
    try {
      sendMessage("massage", { message: massage });
      appendoutmassage(massage);
      setmassage("");
    } catch (error) {
      console.log(error);
    }
  };

  // Add incoming message to state
  function appendmassage({ inmassage, sender }) {
    setMessages((prev) => [
      ...prev,
      { type: "in", text: inmassage, sender },
    ]);
  }

  // Add outgoing message to state
  function appendoutmassage(outmassage) {
    setMessages((prev) => [
      ...prev,
      { type: "out", text: outmassage },
    ]);
  }

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
        <div className="message_section relative lg:min-w-[500px] lg:max-w-[500px] h-[70vh] bg-zinc-600 rounded-2xl p-2 ">
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
          <div className="relative h-[82%] my-1 bg-zinc-500 rounded-md w-full flex  flex-col gap-1 ">
            <div
              className="relative h-[100%] my-1 bg-zinc-00 rounded-md w-full flex flex-col gap-1 overflow-y-auto "
            >
              {messages.map((msg, idx) =>
                msg.type === "in" ? (
                  <div
                    key={idx}
                    className={`  mt-2 ml-1 rounded-md py-2 px-3 break-words ${msg.sender === "AI" ? " bg-blue-950 text-green-200 w-[85%]" : "bg-blue-300 w-[55%]"}`}
                  >
                    <span className="font-bold">{msg.sender} :</span>
                    <br />
                    {msg.sender === "AI"?<div className='overflow-x-auto'><Markdown  className="max-w-none prose prose-invert [&_pre]:overflow-x-auto [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:bg-gray-900 [&_pre]:text-white [&_code]:text-sm">{msg.text}</Markdown></div>:<>{msg.text}</>}
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="ml-auto w-[55%] bg-blue-400 mt-2 mr-1 rounded-md py-2 px-3 break-words"
                  >
                    {msg.text}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="absolute bottom-2 w-[92%] flex items-center justify-between">
            <textarea
              ref={textareaRef}
              rows={1}
              className="  w-[87%] resize-none max-h-[100px] overflow-hidden scroll-track p-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your message..."
              value={massage}
              onChange={(e) => setmassage(e.target.value)}
              style={{
                minHeight: "48px",
                height: "auto",
              }}
            />
            <i
              onClick={
                massage
                  ? (e) => sendmassage(e)
                  : () => {
                      alert("write something");
                    }
              }
              className="ri-send-plane-fill text-3xl cursor-pointer"
            ></i>
          </div>
        </div>
        <div className="project_section  w-full lg:max-w-[75%]  h-[70vh] bg-zinc-700 flex">
          <div className="w-[20%] h-full flex flex-col gap-2 p-2 bg-zinc-800">
            {Object.keys(filetree).map((file,index) => {
              return (
                <div 
                key={index}
                onClick={(e)=>{
                  setcurrentfile(file)
                  setopenedfiles([ ...new Set([ ...openedfiles, file ]) ])
                }}
                className="flex gap-2 items-center bg-zinc-700 p-2 rounded cursor-pointer">
                  <p className="text-lg text-white font-semibold">{file}</p>
                </div>
              );
            })}
            </div>
            <div
            className="w-[80%] relative h-full bg-zinc-600 overflow-y-auto">
              <div className='w-[48%] fixed h-[8%]  flex bg-zinc-950  items-center '>
                {openedfiles.map((file,index)=>{
                  return(
                    <div key={index} 
                    onClick={()=>{setcurrentfile(file)}}
                    className='w-fit h-fit flex justify-center items-center bg-zinc-700 p-2 mx-1 mt-1 rounded cursor-pointer'>
                     
                     <p className='text-lg text-white font-semibold '>{file}</p>
                     <i
                     onClick={()=>{
                      setopenedfiles(openedfiles.filter((f)=>{
                        return f!==file
                      }))
                      setcurrentfile(openedfiles[openedfiles.length-1])
                     }}
                      className="ri-close-line text-white text-xl ml-1 mt-1 cursor-pointer"></i>
                    </div>
                  )
                })}
              </div>
              <div className='w-full h-[90%] pt-[10%]  p-3'>
             {filetree[currentfile]?.file?.contents ? (
  <Markdown className="max-w-none prose prose-invert [&_pre]:overflow-x-auto [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:bg-gray-900 [&_pre]:text-white [&_code]:text-sm">
    {`\`\`\`js
${filetree[currentfile].file.contents}
\`\`\``}
  </Markdown>
) : (
  <p className="text-white">No file selected or file is empty.</p>
)}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Underproject;
