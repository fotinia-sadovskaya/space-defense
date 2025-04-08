import { updateHUD } from "./ui.js"; // Якщо треба показувати щось на екрані

const socket = io(); // Підключення до WebSocket сервера

socket.on("connect", () => {
  console.log("🔌 Підключено до сервера WebSocket");
});

// Наприклад, отримаємо очки іншого гравця:
socket.on("player-score", (data) => {
  console.log("Інший гравець має", data.score, "очок");
});

// Можемо відправити подію на сервер
function sendScore(score) {
  socket.emit("score-update", { score });
}

export { sendScore };
