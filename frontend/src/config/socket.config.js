import socket from 'socket.io-client'

let socketinstance = null

export const initialSocket = (projectId)=>{
    socketinstance = socket(import.meta.env.VITE_BACKEND_URL,{
        withCredentials: true,
          query: {
            projectId
        }

        
    })
    return socketinstance
}

export const receiveMessage = (eventName, cb) => {
     if (!socketinstance) return;
  socketinstance.off(eventName); // আগেরটা মুছে ফেলা
  socketinstance.on(eventName, cb); // নতুন attach
}

export const sendMessage = (eventName, data) => {
    socketinstance.emit(eventName, data);
}