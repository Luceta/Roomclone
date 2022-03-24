import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.set("view engine", "pug");

app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
const httpServer = http.createServer(app);
httpServer.listen(3000, handleListen);

const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });

  socket.on("new_message", (msg, room, done) => {
    console.log(msg, room);
    socket.to(room).emit("new_message", msg);
    done();
  });
});

////http and ws Server same Server
//const server = http.createServer(app);
//const wss = new WebSocketServer({ server });

//server.listen(3000, handleListen);

//const backSocket = [];

//wss.on("connection", (socket) => {
//  console.log("Connected to Browser ✅");
//  backSocket.push(socket);

//  socket["nickname"] = "annoys";
//  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
//  socket.on("message", (msg) => {
//    const message = JSON.parse(msg);
//    switch (message.type) {
//      case "new_message":
//        backSocket.forEach((aSocket) =>
//          aSocket.send(`${socket.nickname}: ${message.payload}`)
//        );
//      case "nickname":
//        socket["nickname"] = message.payload;
//    }
//  });
//});
