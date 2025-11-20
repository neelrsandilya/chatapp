import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthstore";
import { socket } from "../socket";


const notifSound = new Audio('/sounds/notification.mp3')


export const useChatStore= create((set,get) => ({ 
  socket,

    
contacts:[],
chats:[],
messages:[],
isUsersLoading:false,
isMessagesLoading:false,
selectedUser: null,
activeTab:"chats",


// selectedImg:null,


isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) ===false,

// setSelectedImg:(e) => { selectedImg:e },


toggleSound: () => { 
    set({isSoundEnabled:!get().isSoundEnabled});
    localStorage.setItem("isSoundEnabled",!get().isSoundEnabled)

 },
setActiveTab: (tab) => { set({activeTab:tab}) },
setSelectedUser: (selectUser) => { set({selectedUser:selectUser}) },

 getMyChatPartners: async () => { 
    try { set({isUsersLoading:true})
            const res= await axiosInstance.get('/message/chat')
    set({chats:res.data.chatPartners || []})
    } catch (error) {
        toast.error("Cant fetch Chat Partners")
        
    }finally{
        set({isUsersLoading:false})
    }



  },
 getContacts: async () => { 
    try { set({isUsersLoading:true})

            const res= await axiosInstance.get('/message/contacts')
    set({contacts:res.data})

    } catch (error) {
        toast.error("Cant fetch Contacts ")
        
    }finally{
        set({isUsersLoading:false})
    }



  },


  getMessagesbyUserId:async (userId) => {
        set({ isMessagesLoading: true });

    try {
        const res =await axiosInstance.get(`/message/${userId}`)
        set({messages:res.data})
        
    } catch (error) {
     toast.error(error.response?.data?.message || "Something went wrong");

    }finally{
                set({ isMessagesLoading: false });

    }
    
  },


  sendMessage:async (messageData) => {
     const {selectedUser,messages}=get()
    const {authUser}=useAuthStore.getState()

     const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, 
    };
    set({ messages: [...messages, optimisticMessage] });

   
        

    try {
        const res =await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData, {withCredentials: true})
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === tempId ? res.data : m
        ),
      }));
        
    } catch (error) {
             set((state) => ({
        messages: state.messages.filter((m) => m._id !== tempId),
      }));

     toast.error(error.response?.data?.message || "Something went wrong");

    }
  },

  
//   subscribetoMessages: () => { 


//     const {socket,isSoundEnabled}=useAuthStore.getState()

//     const{selectedUser,messages}=get()

//     if (!selectedUser || !socket) {
//         console.warn("Cannot subscribe: No selected user or socket not connected");
//         return;
//     }
// socket.on("newMessage", (msg) => {
//     set((state) => ({ messages: [...state.messages, msg] }));
//     if (isSoundEnabled) {
//     notifSound.currentTime=0;
//     notifSound.play().catch((err) => { console.log("Error playing msg sound") })
    
// }
// });


    

//    },

   subscribetoMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const subscribe = () => {
      socket.off("newMessage"); 

      socket.on("newMessage", (msg) => {
        const { selectedUser, isSoundEnabled, messages } = get();
        if (
          selectedUser &&
          (msg.senderId === selectedUser._id || msg.receiverId === selectedUser._id)
        ) {
          set({ messages: [...messages, msg] });
          if (isSoundEnabled) {
            notifSound.currentTime = 0;
            notifSound.play().catch((err) => console.log("Error playing sound", err));
          }
        }
      });
    };

    if (!socket) {
      const unsubscribe = useAuthStore.subscribe(
        (s) => s.socket,
        (newSocket) => {
          if (newSocket) {
            subscribe();
            unsubscribe(); 
          }
        }
      );
    } else {
      subscribe();
    }
  },

   unsubscribetoMessages: () => { 

       
         if (!socket) return;
            socket.off("newMessage")


    
    }













}))