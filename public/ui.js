import {
  getStore,
  toggleSound,
  buyUpgrade,
  isMuted,
  addCoins,
} from "./utils/store.js";

import { updateScore, updateHighScoreUI } from "./utils/score.js";
import { sendScore } from "./socket-client.js"; // Якщо треба показувати щось на екрані

if (isMuted()) {
  audioElement.volume = 0;
}

export function updateStoreUI() {
  const coinsSpan = document.getElementById("storeCoins");
  if (coinsSpan) {
    coinsSpan.textContent = getStore().coins;
  }
}

window.toggleSound = function () {
  toggleSound();
  alert(`🔊 Звук: ${getStore().mute ? "вимкнено" : "увімкнено"}`);
};

// Оновлення магазину
window.closeStore = function () {
  const store = document.getElementById("store");
  if (store) store.remove(); // або store.style.display = "none";
};

// 👇 Це викликати після купівлі
window.buyUpgrade = function (name) {
  buyUpgrade(name);
  alert(`✅ Куплено: ${name}`);
  updateStoreUI();
  updateScore(0); // Оновлення UI
  updateHighScoreUI(); // Оновлення UI

  // Відправка даних на сервер
  const store = getStore();
  const coins = store.coins;
  const weapons = store.weapons;
  const data = { coins, weapons };
  sendScore(data); // Відправка даних на сервер

  const btns = document.querySelectorAll(".store__btn");
  btns.forEach((btn) => {
    if (btn.textContent.includes(name)) {
      btn.classList.add("store__btn--owned");
      btn.disabled = true;
    }
  });
};
