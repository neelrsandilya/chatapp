import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound.jsx";
import { useAuthStore } from "../store/useAuthStore";
import { useRef } from "react";

const ChatsList = () => {

    const{onlineUsers}=useAuthStore()
    const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();

    useEffect(() => {
  
      getMyChatPartners()

    }, [])


    if(isUsersLoading)return <UsersLoadingSkeleton/>;
if (!chats || chats.length === 0) return <NoChatsFound />;
    

  return (

   <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div 
            className={`avatar ${onlineUsers?.includes(String(chat._id)) ? "online" : "offline"}`}
            >
              <div className="size-12 rounded-full">
                <img src={chat.pp || "/avatar.png"} alt={chat.fullname} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">{chat.fullname}</h4>
          </div>
        </div>
      ))}
    </>
    
    

  )
}

export default ChatsList