const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let playersOnline = 0;

io.on("connection", (socket) => {
  playersOnline++;
  console.log("🧑‍🚀 Гравець підключився:", socket.id);
  io.emit("players-count", playersOnline);

  socket.on("set-name", (name) => {
    console.log(`🎮 Ім’я гравця: ${name}`);
    socket.broadcast.emit("player-joined", name);
  });

  socket.on("disconnect", () => {
    playersOnline--;
    io.emit("players-count", playersOnline);
    console.log("🚪 Гравець вийшов:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🌐 Сервер запущено на http://localhost:${PORT}`);
});
