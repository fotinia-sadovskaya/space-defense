import { showToast } from "./utils/notify.js";

// Ключ для localStorage
const PROFILE_KEY = "playerName";

// Зберегти ім’я
export function setPlayerName(name) {
  if (!name || name.trim() === "") {
    showToast("❗ Введіть ім’я гравця");
    return;
  }
  localStorage.setItem(PROFILE_KEY, name);
  showToast(`👩‍🚀 Ім’я збережено: ${name}`);
}

// Отримати ім’я
export function getPlayerName() {
  return localStorage.getItem(PROFILE_KEY) || "Гравець";
}
