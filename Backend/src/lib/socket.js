import {Server} from "socket.io"
import express from 'express'
import http from 'http'
import 'dotenv/config'
import { socketmiddleware } from "../middleware/socketmiddleware.js"

const app =express()

const server = http.createServer(app)

const io= new Server(server,{
    cors:{ origin: "https://chatapp-front-b7la.onrender.com",
      credentials:true
    },transports: ["websocket", "polling"],
}
)


io.use(socketmiddleware)



const useSocketMap={}


const emailtoSocketId=new Map()
const SocketIdtoemail=new Map()


export const getUserSocketId = (userId) => { 
    return useSocketMap[userId];
 }

io.on("connection",(socket) => { 

    const user = socket.user;
  const userId = user?._id;

  if (!userId) {
    console.warn("⚠️ No userId found on socket connection");
    return;
  }


    useSocketMap[userId]=socket.id
  console.log(`${user.fullname} connected.`);

     io.emit("onlineUsers",Object.keys(useSocketMap))



     socket.on("join:room",(data) => { 

        const {MyEmail,room} =data;


        emailtoSocketId.set(MyEmail,socket.id)
        SocketIdtoemail.set(socket.id,MyEmail)

      socket.join(room)
    io.to(room).emit("user:joined",{MyEmail,id:socket.id})
  

    io.to(socket.id).emit("room:joined",{MyEmail,room})

     })

     socket.on("call",({to,offer})=>{
        io.to(to).emit("call",{from:socket.id,offer})
     })


     socket.on("acceptCall",({to,ans})=>{
        io.to(to).emit("acceptCall",{from:socket.id,ans})
     })


      socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });


  // socket.on("callReq", ({email,room}) => { 
  //   const recId = emailtoSocketId.get(email)
  //   const frS=socket.id;
  //   const senderId= SocketIdtoemail.get(socket.id)
  //   console.log(useSocketMap)

  //   io.to(recId).emit("callReq",{from: senderId,fromSocket:frS, room})
  //   console.log("sent call req")
    
  //  })

    socket.on("callReq", ({ toUserId, room }) => {




    const receiverSocketId = getUserSocketId(toUserId);
    const senderId = userId; 

    console.log("📞 callReq triggered by:", senderId, "to:", toUserId);
    console.log("useSocketMap:", useSocketMap);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callReq", {
        from: senderId,
        fromSocket: socket.id,
        room,
      });
      console.log("✅ Sent call req to", toUserId);
    } else {
      console.log("❌ Receiver not online:", toUserId);
    }
  });
  

  socket.on("callEnded",({to}) => { 
    io.to(to).emit("callEnded")
   })



socket.on("disconnect",() => { 
    console.log(socket.user.fullname, "disconnected")
    delete useSocketMap[userId];
        console.log(`${user.fullname} disconnected.`);

     io.emit("onlineUsers",Object.keys(useSocketMap))

 })
  });



 export {io,app,server}