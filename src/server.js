import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import { SocketAddress } from "net";

const app = express();
app.set("view engine", "pug");

app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

////http and ws Server same Server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

server.listen(3000, handleListen);

const backSocket = [];

wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  backSocket.push(socket);

  socket["nickname"] = "annoys";
  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        backSocket.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});
