import { VideoIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'

import { useVideoStore } from "../store/useVideoStore";
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/useAuthstore';
import {nanoid} from 'nanoid'




const VideoButton = () => {
  const { selectedUser } = useChatStore()


  const navigate = useNavigate()
  const { authUser } = useAuthStore()

  const MyEmail = authUser.email;
  const sem = selectedUser.email

  const { socket, room, setEmail, setRoom, sendReq } = useVideoStore();


const formatTimeForId = () =>
  new Date()
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(":", "");


  


if(room){
  console.log("room set")
}



  const handleInit =  () => {

    if(room){
  if (!selectedUser) {
    console.error("No selectedUser — cannot create or join room.");
    return;
  }

  if (!authUser || !authUser._id) {
    console.error("No authUser._id available.");
    return;
  }

  if (!MyEmail?.trim()) {
    alert("Please enter email");
    return;
  }

 
  setEmail(sem);     

    if (!socket) {
      console.error("❌ Socket not connected");
      return;
    }

    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => {
        console.log("🟢 Socket connected, joining room...");
        socket.emit("join:room", { MyEmail, room });
      })

    } else {
      console.log("🟢 Emitting join:room", { MyEmail, room });
      socket.emit("join:room", { MyEmail, room });
    }

  }else{
    console.log("room doesnt exist")
  }

  }

  const handleRoom =() => { 
  const roomId = `${authUser._id}_${selectedUser._id}_${formatTimeForId()}`;

        setRoom(roomId);
        handleInit()

     }

  const handleRoomJoined =
    ({ MyEmail, room }) => {

      console.log(`✅ You joined room ${room} as ${MyEmail}`);

      navigate(`/room/${room}`)
      sendReq()

    }


  const handleUserJoined = ({ MyEmail, id }) => {
    console.log(`👋 ${MyEmail} (${id}) joined the room`);
  }


  useEffect(() => {

    if (!socket) return;
    if (!socket.connected) socket.connect();



    socket.on("room:joined", handleRoomJoined);
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("room:joined", handleRoomJoined);
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleRoomJoined, handleUserJoined]);



  return (
    <div>
      <button className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" onClick={handleRoom} >
        <VideoIcon />
      </button>


    </div>
  )
}

export default VideoButton