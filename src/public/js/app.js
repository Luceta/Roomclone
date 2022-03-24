const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");

  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
  addMessage("someone joined");
});

socket.on("bye", () => {
  addMessage("someone left ㅠㅠ");
});

socket.on("new_message", addMessage);

//webSocket
//const messageList = document.querySelector("ul");

//const nicknameForm = document.querySelector("#nick");
//const messageForm = document.querySelector("#message");

//const socket = new WebSocket(`ws://${window.location.host}`);

//const makeMessage = (type, payload) => {
//  const msg = { type, payload };
//  return JSON.stringify(msg);
//};

//socket.addEventListener("open", () => {
//  console.log("Connected to Server ✅");
//});

//socket.addEventListener("message", (message) => {
//  console.log("mesag form back!!", message);
//  const li = document.createElement("li");
//  li.innerText = message.data;
//  messageList.append(li);
//});

//socket.addEventListener("close", () => {
//  console.log("Disconnected from Server ❌");
//});

//const handleSubmit = (event) => {
//  event.preventDefault();
//  const input = messageForm.querySelector("input");
//  socket.send(makeMessage("new_message", input.value));
//  input.value = "";
//};

//const handleNicknameSubmit = (event) => {
//  event.preventDefault();
//  const input = nicknameForm.querySelector("input");
//  socket.send(makeMessage("nickname", input.value));
//};

//messageForm.addEventListener("submit", handleSubmit);
//nicknameForm.addEventListener("submit", handleNicknameSubmit);
