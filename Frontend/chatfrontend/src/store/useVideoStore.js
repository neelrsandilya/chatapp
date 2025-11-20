import { create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { usePeerStore } from "./usePeerStore";
import { socket } from "../socket";
import { useChatStore } from "./useChatStore";
import { useNavigate } from "react-router";

// const navigate=useNavigate()

export const useVideoStore= create((set,get) => ({ 

  socket,


myStream:null,
remoteSocketId:null,
room:null,
incomingRoom:null,
incomingFrom:null,
email:null,

setEmail: (em) => { set({email:em}) },
setRoom: (rm) => { set({room:rm}) },
setIncomingRoom: (rm) => { set({incomingRoom:rm}) },
setIncomingFrom: (rm) => { set({incomingFrom:rm}) },

isIncoming:false,
setIsIncoming: (st) => {set({isIncoming:st})},
setRemoteSocketId: (st) => {set({remoteSocketId:st})},
setMyStream: (st) => {set({myStream:st})},




setupPeer:() => { 
       const { peer } = usePeerStore.getState();
  if (!peer) return;

  peer.onnegotiationneeded = async () => {
    console.log("🌀 Negotiation needed...");
    await get().handleNegoNeeded();
  };

   },


handleCall:async() => { 

  const { initialisePeerConnection } = usePeerStore.getState();
const peer =  initialisePeerConnection();


    const {remoteSocketId} =get()
    
  const{ getOffer} =usePeerStore.getState()

  const{setupPeer}= get()
setupPeer()

    const stream =await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    set({myStream:stream})


  const senders = peer.getSenders();
  stream.getTracks().forEach(track => {
    if (!senders.find(s => s.track === track)) {
      peer.addTrack(track, stream);
    }
  });
 

    const offer =await getOffer()


    socket.emit("call",{to:remoteSocketId,offer})

 },

handleIncoming:async ({from,offer}) => { 
  const { initialisePeerConnection,getAnswer} = usePeerStore.getState();
const peer =  initialisePeerConnection();

const{setupPeer}= get()
setupPeer()

const existingStream =get().myStream
let stream =existingStream;

if(!existingStream){
   stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
set({myStream:stream, remoteSocketId:from})

}
    set({ remoteSocketId: from });

    
  const senders = peer.getSenders();
  stream.getTracks().forEach(track => {
    if (!senders.find(s => s.track === track)) {
      peer.addTrack(track, stream);
    }
  });


 const ans = await getAnswer(offer)
socket.emit("acceptCall",{to:from,ans})

},



handleCallAccepted:async ({from,ans}) => { 

const{setRemoteDescription}= usePeerStore.getState()

 await setRemoteDescription(ans)

    get().sendStreams();

 },





handleUserjoined: (data) => { 
   const{handleCall}=get()
    const{MyEmail,id} =data;
    console.log(`${MyEmail} joined the Video chat`)
    set({remoteSocketId:id})
handleCall()


 },


  sendStreams : () => {
  const { peer } = usePeerStore.getState();
  const { myStream } = get();

  if (!myStream) return;

  const senders = peer.getSenders();
  const tracks = myStream.getTracks();

  // tracks.forEach((track, i) => {
  //   if (senders[i]) {
  //     senders[i].replaceTrack(track);
  //   } else {
  //     peer.addTrack(track, myStream);
  //   }
  // })

   tracks.forEach((track) => {
    const sender = senders.find(s => s.track && s.track.kind === track.kind);
    if (sender) {
      sender.replaceTrack(track);
    }})
},


  handleNegoNeeded: async () => {
        const { getOffer} = usePeerStore.getState();

    const { remoteSocketId} = get();
    const offer = await getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  },

  handleNegoNeedIncoming: async ({ from, offer }) => {
        const { getAnswer} = usePeerStore.getState();

    const ans = await getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans });
  },

  handleNegoNeedFinal: async ({ ans }) => {
        const { setRemoteDescription} = usePeerStore.getState();

    await setRemoteDescription(ans);
  },

  sendReq: () => { 

        const{selectedUser}= useChatStore.getState()
        const { email,room } = get();

        if(!email){
          alert("No receiver email")
        }else{
        socket.emit("callReq",{toUserId:selectedUser._id,room})
        }
   },

  handleCallReq: ({from,fromSocket,room}) => { 
            console.log("received call req")
            const {setIncomingFrom,setIncomingRoom,setIsIncoming}= get()

         setIncomingRoom(room)
        setIncomingFrom(fromSocket)
        setIsIncoming(true)
       
        
       },

       endCall: () => { 

        
        },
  
  

        
returnHome:() => { 
          
          // navigate(`/`);
         }
  


 

}))
