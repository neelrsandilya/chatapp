import { PhoneIcon, XIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'
import { useVideoStore } from '../store/useVideoStore'
import { useAuthStore } from '../store/useAuthstore'
import { sound3 } from '../hooks/ringtoneSounds'
import { useEffect } from 'react'


const CallUI = () => {

    const navigate =useNavigate()
 const {incomingFrom,incomingRoom,socket,isIncoming,setIsIncoming}=useVideoStore()
 const {authUser}=useAuthStore()







  useEffect(() => {
   
  if(isIncoming){
    sound3.currentTime=48; sound3.play().catch((error) => { console.log(error) })

  }else{
    sound3.pause()
        sound3.currentTime = 0;

  }
  }, [isIncoming])
  
    const goToRoom=async () => { 

       await socket.emit("join:room", { MyEmail:authUser.email, room:incomingRoom });

       
           navigate(`/room/${incomingRoom}`)
           sound3.pause()
        setIsIncoming(false) 
        
     }


     
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center">



  <button className=' flex flex-end' onClick={() => { setIsIncoming(false) }} >

<XIcon className=" w-8 h-8 text-white  "/>

  </button>

<button 
  onClick={goToRoom} 
  className="relative p-5 rounded-full bg-green-600 hover:bg-green-700 
             transition transform hover:scale-110 shadow-lg 
             shadow-green-500/50 animate-pulse"
>
  <PhoneIcon className="w-8 h-8 text-white drop-shadow-md" />
</button>

</div>

  )
}

export default CallUI