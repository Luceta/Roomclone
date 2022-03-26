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
