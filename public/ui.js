import {
  getStore,
  buyUpgrade,
  toggleSound,
  isMuted,
  addCoins,
  isUpgradeOwned,
} from "./utils/store.js";

import { showToast } from "./utils/notify.js";
import { playSound } from "./utils/sound.js";

//import { Player } from "./player.js"; // Якщо треба показувати щось на екрані
//import { updateCoinsUI } from "./utils/store.js"; // Якщо треба показувати щось на екрані

//import { updateScore, updateHighScoreUI } from "./utils/score.js";
//import { sendScore } from "./socket-client.js"; // Якщо треба показувати щось на екрані

// 🎯 Оновлення магазину (монети + статус кнопок)
export function updateStoreUI() {
  const coinsSpan = document.getElementById("storeCoins");
  if (coinsSpan) {
    coinsSpan.textContent = getStore().coins;
  }

  // Позначаємо куплені апгрейди
  const buttons = document.querySelectorAll(".store__btn");
  buttons.forEach((btn) => {
    const upgrade = btn.dataset.upgrade;
    if (isUpgradeOwned(upgrade)) {
      btn.classList.add("store__btn--owned");
      btn.disabled = true;
    }
  });
  // Знаходимо кнопки за класом
  // const buttons = document.querySelectorAll(".store__btn");
  // buttons.forEach((btn) => {
  //   const text = btn.textContent.toLowerCase();
  //   if (text.includes("ракета") && isUpgradeOwned("rocket")) {
  //     btn.classList.add("store__btn--owned");
  //     btn.disabled = true;
  //   }
  //   if (text.includes("лазер") && isUpgradeOwned("laser")) {
  //     btn.classList.add("store__btn--owned");
  //     btn.disabled = true;
  //   }
  // });
}

// 🎮 Оновлення HUD (поточна зброя, очки, рекорд)
export function updateHUD({
  score = 0,
  weapon = "Звичайна",
  highscore = 0,
} = {}) {
  const weaponSpan = document.getElementById("weaponType");
  const scoreSpan = document.getElementById("score");
  const highscoreSpan = document.getElementById("highscore");

  if (weaponSpan) weaponSpan.textContent = weapon;
  if (scoreSpan) scoreSpan.textContent = score;
  if (highscoreSpan) highscoreSpan.textContent = highscore;
}

// ⛔ Закриття магазину ✖
// 🛠 Глобальні функції для HTMX
window.closeStore = function () {
  const store = document.getElementById("store");
  if (store) store.remove(); // або store.style.display = "none";
};

// 👇 Це викликати після купівлі
window.buyUpgrade = function (name) {
  buyUpgrade(name);
  showToast(`✅ Куплено: ${name}`);

  //  alert(`✅ Куплено: ${name}`);
  //  console.log(`✅ Куплено: ${name}`);

  updateStoreUI();
};

window.toggleSound = function () {
  toggleSound(); // оновлює store
  const isMuted = getStore().mute;

  if (!isMuted) playSound("toggle"); // тільки коли звук увімкнено

  const icon = isMuted ? "🔇" : "🔊";
  showToast(`${icon} Звук: ${isMuted ? "вимкнено" : "увімкнено"}`);
};

if (isMuted()) {
  audioElement.volume = 0;
}

window.buyUpgrade = function (name) {
  buyUpgrade(name);
  showToast(`✅ Куплено: ${name}`);
  playSound("buy");
  updateStoreUI();
};

// Додати клас до кнопки, щоб показати, що оновлення вже куплено
// Знайти кнопку за текстом
// const btn = document.querySelector(`.store__btn:contains('${name}')`);
// if (btn) {
//   btn.classList.add("store__btn--owned");
//   btn.disabled = true;
// }
