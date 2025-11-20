import { create} from "zustand";
import toast from "react-hot-toast";


export const usePeerStore= create((set,get) => ({ 

peer:null,


 

initialisePeerConnection : () => { 

const existingPeer= get().peer


if(existingPeer)return existingPeer;

    const peer = new RTCPeerConnection({
    iceServers:[{urls:["stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478"]}]
})

    set({ peer });
    return peer;


 }



 ,getOffer: async () => { 



const{peer}=get()

  if(!peer){
        throw new Error("Peer not Initialized")
    }


    const offer =await peer.createOffer()
    await peer.setLocalDescription(new RTCSessionDescription(offer))
    
return offer;
 },

getAnswer : async (offer) => { 

    const{peer}=get()
      if(!peer){
        throw new Error("Peer not Initialized")
    }


    await peer.setRemoteDescription(new RTCSessionDescription(offer))
    const ans =await peer.createAnswer()

     await peer.setLocalDescription(new RTCSessionDescription(ans))
    
return ans;
 },


setRemoteDescription: async (ans) => {
  const { peer } = get();
  if (!peer) throw new Error("Peer not Initialized");
  await peer.setRemoteDescription(new RTCSessionDescription(ans));
}


}))
