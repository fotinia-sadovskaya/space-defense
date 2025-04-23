import { debugMode } from "./utils/debug.js";
import Enemy from "./enemy.js";
import Player from "./player.js";
import Bullet from "./bullet.js";
import Asteroid from "./asteroid.js";

import { updateScore, updateHighScoreUI, getHighScore } from "./utils/score.js";
import { showToast } from "./utils/notify.js";
import { setPlayerName } from "./profile.js";
import {
  toggleSound,
  isMuted,
  buyUpgrade,
  addCoins,
  isUpgradeOwned,
  getStore,
} from "./utils/store.js";
import { updateHUD, updateStoreUI } from "./ui.js";
import { playSound } from "./utils/sound.js";

// import { initSocket } from "./socket-client.js";
// initSocket(); // 🔗 Підключення до WebSocket сервера

// 🧠 Глобальні змінні
let currentScore = 0;
let currentWeapon = "normal";

// 🎧 Для перемикача звуку
window.toggleSound = function () {
  toggleSound();
  const mute = getStore().mute;
  showToast(mute ? "🔇 Звук вимкнено" : "🔊 Звук увімкнено");
  if (!mute) playSound("toggle");
  updateStoreUI();
};

// 💰 Покупки
window.buyUpgrade = function (name) {
  buyUpgrade(name);
  playSound("buy");
  showToast(`✅ Куплено: ${name}`);
  updateStoreUI();
};

// 👤 Збереження імені
window.setPlayerNameFromInput = function () {
  const input = document.getElementById("playerNameInput");
  if (input) {
    setPlayerName(input.value);
    showToast(`👤 Ім’я збережено: ${input.value}`);
  }
};

// 🌌 Переклад назви зброї
function translateWeaponName(type) {
  return (
    {
      normal: "Звичайна",
      strong: "Сильна",
      laser: "Лазер",
    }[type] || "Невідома"
  );
}

// 🧠 Оновлення HUD після HTMX
document.body.addEventListener("htmx:afterSwap", (e) => {
  if (
    e.detail.target.id === "hud-container" ||
    e.detail.target.classList.contains("hud")
  ) {
    if (debugMode) console.log("♻️ HUD оновлено");
    updateHUD({
      score: currentScore,
      highscore: getHighScore(),
      weapon: translateWeaponName(currentWeapon),
    });
  }
});

// 🎮 Оновлення магазину
document.body.addEventListener("htmx:afterSwap", async (e) => {
  if (e.detail.target.classList.contains("store")) {
    const ui = await import("./ui.js");
    ui.updateStoreUI();
  }
});

// 🎧 Відкрити магазин
document.addEventListener("keydown", (e) => {
  if (e.code === "KeyM") {
    fetch("partials/ui-store.partial.html")
      .then((res) => res.text())
      .then((html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        document.body.appendChild(div.firstElementChild);
        updateStoreUI();
      });
  }
});

// 🎮 Ініціалізація гри
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bullets = [];
const enemies = [];
const asteroids = [];
const player = new Player(canvas, bullets);

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 50);
  const enemy = new Enemy(canvas, x, 0);
  enemies.push(enemy);
  if (debugMode)
    console.log("👾 Новий ворог створено!", {
      x,
      y: enemy.y,
      total: enemies.length,
    });
}
setInterval(spawnEnemy, 2000);

function spawnAsteroid() {
  const x = Math.random() * (canvas.width - 60);
  const speed = 1 + Math.random() * 2;
  asteroids.push(new Asteroid(canvas, x, -60, speed));
}
setInterval(spawnAsteroid, 3500);

function updateWeaponUI() {
  const span = document.getElementById("weaponType");
  if (span) span.textContent = translateWeaponName(currentWeapon);
}
updateWeaponUI();

// 🔁 Головний ігровий цикл
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bullets.forEach((bullet, index) => {
    bullet.move();
    bullet.draw();
    if (bullet.isOutOfScreen()) {
      bullets.splice(index, 1);
    }
  });

  asteroids.forEach((asteroid, index) => {
    asteroid.move();
    asteroid.draw();
    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1);
    }
  });

  checkCollisions();

  enemies.forEach((enemy, index) => {
    enemy.move();
    enemy.draw();
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });

  player.draw();

  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  player.resize();

  enemies.forEach((enemy) => enemy.resize?.());
  asteroids.forEach((asteroid) => asteroid.resize?.());

  if (debugMode)
    console.log("📱 Canvas та об'єкти адаптовані під новий розмір екрану");
});

// 👾 Керування
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") player.move("left");
  if (event.key === "ArrowRight") player.move("right");
  if (event.key === " ") player.shoot();
  if (event.key === "w") {
    player.changeWeapon();
    currentWeapon = player.weaponTypes[player.weaponIndex];
    updateHUD({
      score: currentScore,
      highscore: getHighScore(),
      weapon: translateWeaponName(currentWeapon),
    });
  }
});

// 🧠 Перевірка зіткнень
function checkCollisions() {
  const bulletsToRemove = new Set();
  const enemiesToRemove = new Set();
  const asteroidsToRemove = new Set();

  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (collisionDetected(enemy, bullet)) {
        explodeProjectile(bullet);
        bulletsToRemove.add(bulletIndex);
        enemiesToRemove.add(enemyIndex);
        currentScore += 10;
        addCoins(10);
        updateScore(currentScore);
        updateHUD({
          score: currentScore,
          highscore: getHighScore(),
          weapon: translateWeaponName(currentWeapon),
        });
      }
    });

    asteroids.forEach((asteroid, asteroidIndex) => {
      if (collisionDetected(asteroid, bullet)) {
        explodeProjectile(bullet);
        bulletsToRemove.add(bulletIndex);
        asteroidsToRemove.add(asteroidIndex);
        currentScore += 5;
        addCoins(5);
        updateScore(currentScore);
        updateHUD({
          score: currentScore,
          highscore: getHighScore(),
          weapon: translateWeaponName(currentWeapon),
        });
      }
    });
  });

  [...bulletsToRemove]
    .sort((a, b) => b - a)
    .forEach((i) => bullets.splice(i, 1));
  [...enemiesToRemove]
    .sort((a, b) => b - a)
    .forEach((i) => enemies.splice(i, 1));
  [...asteroidsToRemove]
    .sort((a, b) => b - a)
    .forEach((i) => asteroids.splice(i, 1));
}

// 💥 Анімація вибуху
function explodeProjectile(bullet) {
  playSound("explode");

  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.position = "absolute";
  explosion.style.left = `${bullet.x}px`;
  explosion.style.top = `${bullet.y}px`;
  explosion.style.width = "120px";
  explosion.style.height = "120px";
  explosion.style.background =
    'url("assets/images/explosion.png") center/cover no-repeat';
  explosion.style.animation = "explode 0.3s ease-out";

  document.body.appendChild(explosion);
  setTimeout(() => explosion.remove(), 300);
}

// 🔍 Колізія
function collisionDetected(enemy, bullet) {
  return (
    bullet.x < enemy.x + enemy.width &&
    bullet.x + bullet.width > enemy.x &&
    bullet.y < enemy.y + enemy.height &&
    bullet.y + bullet.height > enemy.y
  );
}

// 🔁 Старт
gameLoop();
