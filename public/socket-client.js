import { showToast } from "./utils/notify.js"; // Якщо треба показувати щось на екрані
import { updateHUD } from "./ui.js";

// Підключення до WebSocket сервера
export function initSocket() {
  const socket = io();

  socket.on("connect", () => {
    console.log("🛰 Підключено до сервера WebSocket:", socket.id);
  });

  socket.on("players-count", (count) => {
    console.log("👥 Гравців онлайн:", count);
    const el = document.getElementById("playersOnline");
    if (el) el.textContent = count;
  });

  // 🔄 Підтримка оновлення імені
  socket.on("player-joined", (name) => {
    showToast(`👾 До гри приєднався: ${name}`);
  });

  // 👉 Відправити своє ім’я при вході
  const storedName = localStorage.getItem("playerName");
  if (storedName) {
    socket.emit("set-name", storedName);
  }
}

// Наприклад, отримаємо очки іншого гравця:
socket.on("player-score", (data) => {
  console.log("Інший гравець має", data.score, "очок");
});

// Можемо відправити подію на сервер
function sendScore(score) {
  socket.emit("score-update", { score });
}

// export { sendScore };
// export default socket; // Експортуємо сокет для використання в інших модулях
