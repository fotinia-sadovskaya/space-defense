const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("🧑‍🚀 Гравець підключився:", socket.id);

  socket.on("player-move", (data) => {
    socket.broadcast.emit("enemy-update", data); // розсилка іншим
  });

  socket.on("disconnect", () => {
    console.log("🚪 Гравець вийшов:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🌐 Сервер запущено на http://localhost:${PORT}`);
});
