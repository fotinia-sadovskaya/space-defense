import Enemy from "./enemy.js";
import Player from "./player.js";
import Bullet from "./bullet.js";
import Asteroid from "./asteroid.js";
import { updateScore, updateHighScoreUI } from "./utils/score.js";

// Якщо треба показувати щось на екрані
import { isMuted } from "./utils/store.js";
import { toggleSound } from "./utils/store.js";
import { buyUpgrade } from "./utils/store.js";
import { addCoins } from "./utils/store.js";

import { isUpgradeOwned } from "./utils/store.js";
import { getStore } from "./utils/store.js";

//import { updateStoreUI } from "./ui.js";

document.body.addEventListener("htmx:afterSwap", async (e) => {
  if (e.detail.target.classList.contains("store")) {
    const ui = await import("./ui.js");
    ui.updateStoreUI();
  }
});

// Додати обробник події для закриття магазину
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

document.body.addEventListener("htmx:afterSwap", (e) => {
  if (
    e.detail.target.id === "hud-container" ||
    e.detail.target.classList.contains("hud")
  ) {
    console.log("♻️ HUD оновлено");
    updateHUD(); // Ваша функція з ui.js, яка показує очки, рекорд, зброю
  }
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bullets = []; // ✅ Масив для збереження снарядів
const enemies = []; // Масив для ворогів
const asteroids = []; // новий масив для астероїдів
let currentWeapon = "normal"; // або "laser"
const player = new Player(canvas, bullets); // Передаємо bullets у Player ✅ Створюємо гравця

console.log("👾 Всі вороги:", enemies);
console.log("🎯 Масив куль при старті:", bullets);

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 50);
  const enemy = new Enemy(canvas, x, 0);
  enemies.push(enemy);
  console.log("👾 Новий ворог створено!", {
    x,
    y: enemy.y,
    total: enemies.length,
  });
}
setInterval(spawnEnemy, 2000); // ✅ Спавнимо ворога кожні 2 секунди

function spawnAsteroid() {
  const x = Math.random() * (canvas.width - 60);
  const speed = 1 + Math.random() * 2;
  asteroids.push(new Asteroid(canvas, x, -60, speed));
}
setInterval(spawnAsteroid, 3500); // Спавнимо астероїд кожні 3.5 сек

// 🎮 Головний ігровий цикл

function gameLoop() {
  console.log("🔄 Оновлення гри"); // Лог кожного кадру!
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищуємо екран

  bullets.forEach((bullet, index) => {
    // ✅ Використовуємо масив bullets
    bullet.move(); // 🔥 Рух кулі
    console.log("🎯 Куля рухається, нова координата Y:", bullet.y);
    bullet.draw(); // 🔥 Малюємо кулю
    console.log("🎨 Малюємо кулю на позиції:", bullet.x, bullet.y);

    // Видалення кулі, якщо вона зникла (вибухнула),
    // якщо вона виходить за межі екрану
    if (bullet.isOutOfScreen()) {
      bullets.splice(index, 1);
    }
  });

  asteroids.forEach((asteroid, index) => {
    asteroid.move();
    asteroid.draw();

    if (asteroid.y > canvas.height) {
      asteroids.splice(index, 1); // Видалити, якщо вийшов за межі
    }
  });

  checkCollisions(); // 🔥 Додаємо перевірку попадань

  //✅ Рухаємо та малюємо всіх ворогів
  enemies.forEach((enemy, index) => {
    enemy.move();
    enemy.draw();

    if (enemy.y > canvas.height) {
      enemies.splice(index, 1); // Видаляємо ворога, якщо він зник за межами екрану
    }
  });

  player.draw(); // ✅ Малюємо гравця

  requestAnimationFrame(gameLoop);
}

// 🎮 Додаємо керування гравцем
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") player.move("left");
  if (event.key === "ArrowRight") player.move("right");
  if (event.key === " ") player.shoot();
  if (event.key === "w") player.changeWeapon();
});

// ✅ Запускаємо гру
gameLoop();

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    // 🔥 Використовуємо bullets
    enemies.forEach((enemy, enemyIndex) => {
      if (collisionDetected(enemy, bullet)) {
        console.log("💥 Влучення! Видаляємо ворога та кулю.");
        explodeProjectile(bullet); // Додаємо вибух до місця попадання

        //explodeProjectile(enemy.x, enemy.y);

        // Видаляємо тільки поточного ворога
        enemies.splice(enemyIndex, 1);

        // Видаляємо тільки поточний снаряд
        bullets.splice(bulletIndex, 1);
      }
    });
  });

  // Перевірка для астероїдів
  bullets.forEach((bullet, bulletIndex) => {
    asteroids.forEach((asteroid, asteroidIndex) => {
      if (collisionDetected(asteroid, bullet)) {
        console.log("💥 Влучення в астероїд!");
        explodeProjectile(bullet.x, bullet.y);
        bullets.splice(bulletIndex, 1);
        asteroids.splice(asteroidIndex, 1);
      }
    });
  });
}

// Функція для вибуху снаряда
function explodeProjectile(x, y) {
  let explosion = document.createElement("div");
  explosion.classList.add("explosion");
  explosion.style.left = `${x}px`;
  explosion.style.top = `${y}px`;

  document.body.appendChild(explosion);

  setTimeout(() => {
    explosion.remove();
  }, 300); // Вибух триває 0.3 секунди
}

// Перевірка на зіткнення між кулею та ворогом
function collisionDetected(enemy, bullet) {
  console.log(
    `🔍 Перевірка зіткнення: bullet(${bullet.x}, ${bullet.y}) vs enemy(${enemy.x}, ${enemy.y})`
  );
  console.log(
    `🔍 Розміри: bullet(${bullet.width}, ${bullet.height}) vs enemy(${enemy.width}, ${enemy.height})`
  );

  return (
    bullet.x < enemy.x + enemy.width &&
    bullet.x + bullet.width > enemy.x &&
    bullet.y < enemy.y + enemy.height &&
    bullet.y + bullet.height > enemy.y
  );
}

// оновити highscore при старті
updateHighScoreUI();

// десь у твоїй логіці (після знищення ворога, наприклад)
let currentScore = 0;
function handleEnemyDestroyed() {
  currentScore += 10;
  document.getElementById("score").textContent = currentScore;
  updateScore(currentScore);
  updateHighScoreUI();
}
