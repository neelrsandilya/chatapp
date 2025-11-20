import { create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { socket } from "../socket";


export const useAuthStore= create((set,get) => ({ 
  socket,
    authUser: null,
    isCheckingAuth: true,
     isSigningUp:false,
     isLoggingin:false,
     
     onlineUsers:[],
   
    checkAuth: async() => { 
     try {
        const res =await axiosInstance.get('/auth/check');
        set({authUser: res.data})
        get().connectSocket();



        
     } catch (error) {
              console.log("Unauthorized")

        set({authUser:null})
        
     }finally{
        set({isCheckingAuth:false})
     }
    },

   

    signup: async (data) => { 
      set({ isSigningUp: true });
        try {  

             const res =await axiosInstance.post('/auth/signup',data)
      set({authUser:res.data})
        toast.success("Account Created Successfully")
        get().connectSocket()
            
        } catch (error) {
                    toast.error(error.response.data.message)


        }finally{
            set({isSigningUp:false})
        }
       
     },

    login: async (data) => { 
      set({isLoggingin:true})
        try { 

             const res =await axiosInstance.post('/auth/login',data)
      set({authUser:res.data})
        toast.success(" Logged in Successfully")
        get().connectSocket()
            
        } catch (error) {
                    toast.error(error.response?.data?.message)


        }finally{
            set({isLoggingin:false})
        }},

   
   
    logout: async () => {
    try {
       await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      await get().disconnectSocket()
    } catch (error) {
      toast.error("Logout failed");
    }
  },

   updatepp:async (imgurl) => {
    try {
        const res=await axiosInstance.put('/auth/update-profile',{pp:imgurl})
        set({authUser:res.data})
         toast.success("Profile picture updated");

    } catch (error) {
        toast.error("Couldn't update Profile Picture")
    }
    
  },


   connectSocket: async() => { 
    const {authUser} = get()

    if(!authUser || socket?.connected){
      return;
    }


    socket.connect()

      set({socket})
      if(socket?.connected){
        console.log("Socket Connected")}

      socket.off("onlineUsers");

     socket.on("onlineUsers",(userIds) => { 
      set({onlineUsers:userIds});
      })

       socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

      
        
    },

    disconnectSocket: async()=>{

       if (socket?.connected) socket.disconnect()
    }
  
 }))

