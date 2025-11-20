import { PhoneMissed, VideoIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useVideoStore } from '../store/useVideoStore'
import ReactPlayer from 'react-player'
import { useParams } from 'react-router'
import { useRef } from 'react'
import { usePeerStore } from '../store/usePeerStore'
import { useState } from 'react'
import { useNavigate } from 'react-router'







const Room = () => {

      const navigate =useNavigate()

  const [remoteStream, setRemoteStream] = useState()

  const{setEmail,setIncomingRoom,setIncomingFrom,setIsIncoming,setRoom,setMyStream,setRemoteSocketId,returnHome,socket,remoteSocketId,myStream,handleIncoming,handleCallAccepted,handleCall,handleUserjoined,handleNegoNeedIncoming,handleNegoNeedFinal,sendStreams} =useVideoStore()


  const{initialisePeerConnection,peer}=usePeerStore()

    const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const endCall=async() => { 
        console.log("Call End Req received")

   await socket.emit("callEnded",{to:remoteSocketId});

   await myStream?.getTracks()?.forEach(e => {
    e.stop();
    e.enabled=false;
   });
    

    if(myVideoRef.current){
      myVideoRef.current.srcObject=null;
    }

    if(remoteVideoRef.current){
      remoteVideoRef.current.srcObject=null;
    }

    peer?.getSenders()?.forEach(s => s.track?.stop());
peer?.getReceivers()?.forEach(r => r.track?.stop());


  peer?.close()
    setMyStream(null)
 
    setRemoteStream(null)
    setRemoteSocketId(null)
    setRoom(null)
    setEmail(null)
    setIncomingRoom(null)
    setIncomingFrom(null)
    setIsIncoming(false)


 setTimeout(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => s.getTracks().forEach(t => t.stop()));
  }, 200);

  navigate(`/`)

    
   }
   

  useEffect(() => {
const { peer: currentPeer, initialisePeerConnection } = usePeerStore.getState();
  let pc = currentPeer;
  if (!pc) {
    pc = initialisePeerConnection();
  }

  if (!pc) {
    console.error("Peer connection is undefined!");
    return;
  }

    const handleTrack = (event) => {
      const remotestream = event.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remotestream[0]);
    };

    pc.addEventListener("track", handleTrack);

    return () => {
      pc.removeEventListener("track", handleTrack);
    };
  }, [ initialisePeerConnection]);


  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);


  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  


useEffect(() => {



         if (!socket) return;

  if (!socket.connected) socket.connect();
        

   
    socket.on("user:joined",handleUserjoined)
    socket.on("call",handleIncoming)
    socket.on("acceptCall",handleCallAccepted)
   socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);   

    socket.on("callEnded", () => {
  endCall(); 

}); 
  return () => {
        socket.off("user:joined",handleUserjoined)
    socket.off("call",handleIncoming)
    socket.off("acceptCall",handleCallAccepted)
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
    socket.off("peer:nego:final", handleNegoNeedFinal);  
    
  }
}, [socket,
  handleUserjoined,
  handleIncoming,
  handleCallAccepted,
  handleNegoNeedIncoming,
  handleNegoNeedFinal,])






  return (
<div className="absolute w-full min-h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
  {/* Remote Video */}
  <div className="absolute w-full max-w-3xl h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-xl">
    {remoteStream ? (
      <video
        ref={remoteVideoRef} 
        autoPlay
        playsInline
        className="w-full h-full object-cover rounded-xl"
      />
    ) : (
      <div className=" absolute w-full h-full flex items-center justify-center bg-gray-800 rounded-xl">
        <span className="text-gray-400 text-lg">Waiting for user...</span>
      </div>
    )}

    {/* Caller Name & Status Overlay */}
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-md">
      {remoteSocketId ? "✅" : "Waiting..."}
    </div>
  </div>

  {/* Floating "You" Video */}
  {myStream && (
    <div className="absolute bottom-32 right-4 w-24 h-36 md:w-32 md:h-48 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg bg-black">
      <video
        ref={myVideoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1 left-1 bg-gray-800/60 px-1 py-0.5 rounded text-[10px] text-white">
        You
      </div>
    </div>
  )}

  {/* Bottom Action Bar */}
  <div className="absolute bottom-6 flex gap-6 justify-center w-full">
    {/* Mute Button */}
    {myStream && (
      <button className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-all">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 1v22m-6-6h12"
          />
        </svg>
      </button>
    )}


    {
      <button onClick={endCall} className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-all">
       
       <PhoneMissed className='size-5'/>
      </button>
    }

    {/* Persistent Call Button */}


    
    <button
      className={`w-16 h-16 md:w-20 md:h-20 ${
        remoteSocketId ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
      } rounded-full flex items-center justify-center shadow-lg transition-all`}
      onClick={handleCall}
    >


      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5h2l3.5 7-1.5 1-3-6h-1.5V5z"
        />
      </svg>
    </button>

    {/* Switch Camera */}
    {myStream && (
      <button className="w-16 h-16 md:w-20 md:h-20 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-all">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.553-2.276a.5.5 0 01.694.447v6.658a.5.5 0 01-.694.447L15 14M9 10L4.447 7.724a.5.5 0 00-.694.447v6.658a.5.5 0 00.694.447L9 14"
          />
        </svg>
      </button>
    )}
  </div>
</div>


    // <div className="flex flex-col items-center gap-4">
    //   <h1 className="text-xl font-bold">Room Page</h1>
    //   <h4 className="text-gray-600">
    //     {remoteSocketId ? "Connected ✅" : "Waiting for user..."}
    //   </h4>

    //   <div className="flex gap-4">
    //     {myStream && (
    //       <button
    //         className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    //         onClick={sendStreams}
    //       >
    //         Send Stream
    //       </button>
    //     )}
    //     {remoteSocketId && (
    //       <button
    //         className="px-4 py-2 bg-green-600 text-white rounded-lg"
    //         onClick={handleCall}
    //       >
    //         CALL
    //       </button>
    //     )}
    //   </div>

    //   {/* My Video */}
    //   <div>
    //     <h2 className="font-semibold mt-4">My Stream</h2>
    //     <video
    //       ref={myVideoRef}
    //       autoPlay
    //       muted
    //       playsInline
    //       className="rounded-lg border w-[300px] h-[200px] bg-black"
    //     />
    //   </div>

    //   {/* Remote Video */}
    //   {remoteStream && (
    //     <div>
    //       <h2 className="font-semibold mt-4">Remote Stream</h2>
    //       <video
    //         ref={remoteVideoRef}
    //         autoPlay
    //         playsInline
    //         className="rounded-lg border w-[300px] h-[200px] bg-black"
    //       />
    //     </div>
    //   )}
    // </div>
  )
}

export default Room