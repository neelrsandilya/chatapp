import React, { useState, useEffect, useCallback } from "react";
import { useVideoStore } from "../store/useVideoStore";
import { useNavigate } from "react-router"; // ✅ from react-router



const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate(); // ✅ works in react-router v6.4+

  const { socket } = useVideoStore();

  // 🔹 Emit when form submitted
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();

      if (!email.trim() || !room.trim()) {
        alert("Please enter both email and room ID");
        return;
      }

      if (!socket) {
        console.error("❌ Socket not connected");
        return;
      }

      if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => {
        console.log("🟢 Socket connected, joining room...");
        socket.emit("join:room", { email, room });
      });
    } else {
      console.log("🟢 Emitting join:room", { email, room });
      socket.emit("join:room", { email, room });
    }},

    [socket, email, room]
  );

  // 🔹 When YOU join
  const handleRoomJoined = useCallback(
    ({ email, room }) => {
      console.log(`✅ You joined room ${room} as ${email}`);
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  // 🔹 When SOMEONE ELSE joins
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`👋 ${email} (${id}) joined the room`);
  }, []);



   useEffect(() => {

    if (!socket) return;
     if (!socket.connected) socket.connect();


     
    socket.on("room:joined", handleRoomJoined);
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("room:joined", handleRoomJoined);
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleRoomJoined, handleUserJoined]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎥 Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="room">Room ID: </label>
          <input
            type="text"
            id="room"
            placeholder="Enter room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
          />
        </div>

        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
