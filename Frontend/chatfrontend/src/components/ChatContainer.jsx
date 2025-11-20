import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder'
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton'
import MessageInput from './MessageInput'
import { useRef } from 'react'



const ChatContainer = () => {


    const {authUser} =useAuthStore()
    const {selectedUser,getMessagesbyUserId,messages,setSelectedUser,isMessagesLoading,subscribetoMessages,unsubscribetoMessages} =useChatStore()

  
    const messagesEndRef = useRef(null);




useEffect(() => {
  const el = messagesEndRef.current;
  if (!el) return;

  const getScrollParent = (node) => {
    let p = node.parentElement;
    while (p) {
      const overflow = getComputedStyle(p).overflowY;
      if (overflow === 'auto' || overflow === 'scroll') return p;
      p = p.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  };

  const container = getScrollParent(el);
  const start = container.scrollTop;


  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect
    ? container.getBoundingClientRect()
    : { top: 0, left: 0 };
  const target = start + (elRect.top - containerRect.top);

  const duration = 700;
  const startTime = performance.now();
  let rafId = null;

  const easeOut = t => t * (2 - t); 

  const step = (now) => {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = easeOut(t);
    container.scrollTop = start + (target - start) * eased;
    if (t < 1) rafId = requestAnimationFrame(step);
  };

  rafId = requestAnimationFrame(step);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
  };
}, [messages]);






useEffect(() => {
   if (!selectedUser) return;
    getMessagesbyUserId(selectedUser._id)
  subscribetoMessages()

  return () => { 
    unsubscribetoMessages()
   }

}, [selectedUser])

 if (!selectedUser) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        Select a user to start chatting
      </div>
    );
  }


  return (
  <>

  <ChatHeader/>

  <div className="flex-1 px-6 overflow-y-auto py-8">


{isMessagesLoading? (<MessagesLoadingSkeleton />): messages.length>0?(
    <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map((msg,index)=>(
                <div key ={msg._id || index} className={ `chat ${msg.senderId===authUser._id?"chat-end":"chat-start"}`}>

                    <div className={`chat-bubble relative ${msg.senderId==authUser._id?"bg-cyan-600 text-white"
                : "bg-slate-800 text-slate-200"}`}>

                    {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}

                  {msg.text && <p className="mt-2">{msg.text}</p>}


                   <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <div ref={messagesEndRef} />


                </div>          
                </div>
    

            ))
}


    </div>




): (
          <NoChatHistoryPlaceholder name={selectedUser.fullname} />
        )}

  </div>
  
  
  <MessageInput/>
  
  
  
  </>
  )
}

export default ChatContainer