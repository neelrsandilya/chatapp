import React from 'react'
import { useChatStore } from '../store/useChatStore'
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useVideoStore } from '../store/useVideoStore';
import CallUI from '../components/CallUI';
import { useEffect } from 'react';



const ChatPage = () => {

  
  
  const {socket,handleCallReq,isIncoming}=useVideoStore()




  useEffect(() => {
  
  
  
           if (!socket) return;
  
    if (!socket.connected) socket.connect();
    console.log("listening for Call req")
          socket.off("callReq");
  
      socket.on("callReq",handleCallReq)
         

  }, [socket])
  
  
  

  

const{activeTab,selectedUser} =useChatStore()

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>

        {isIncoming && <CallUI/>}

       

        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>

      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage