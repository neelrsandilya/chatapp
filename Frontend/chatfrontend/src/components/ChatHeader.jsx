import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import { XIcon } from 'lucide-react'
import VideoButton from './VideoButton'


const ChatHeader = () => {

    
    const {authUser,onlineUsers} =useAuthStore()
    const {selectedUser,getMessagesbyUserId,setSelectedUser} =useChatStore()

  const isOnline = selectedUser && onlineUsers.includes(String(selectedUser._id))


  return (
      <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div
         className={`avatar ${isOnline ? "online" : "offline"}`}
         >
          <div className="w-12 rounded-full">
            <img src={selectedUser.pp || "/avatar.png"} alt={selectedUser.fullname} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{selectedUser.fullname}</h3>
          <p className="text-slate-400 text-sm">{isOnline? "Online" : "Offline"}</p>
        </div>
      </div>


       <VideoButton/>
      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
    
  )
}

export default ChatHeader