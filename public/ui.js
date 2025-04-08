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

// 👇 Це викликати після купівлі
window.buyUpgrade = function (name) {
  buyUpgrade(name);
  alert(`✅ Куплено: ${name}`);
  updateStoreUI();
};

window.toggleSound = function () {
  toggleSound();
  alert(`🔊 Звук: ${getStore().mute ? "вимкнено" : "увімкнено"}`);
};
