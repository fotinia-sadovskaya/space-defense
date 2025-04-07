import Enemy from "./enemy.js";
import Player from "./player.js";
import Bullet from "./bullet.js";
import Asteroid from "./asteroid.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const bullets = []; // ✅ Масив для збереження снарядів
const enemies = []; // Масив для ворогів
const asteroids = []; // новий масив для астероїдів
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

setInterval(spawnAsteroid, 3500); // Спавн кожні 3.5 сек

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

    asteroids.forEach((asteroid, index) => {
      asteroid.move();
      asteroid.draw();
    
      if (asteroid.y > canvas.height) {
        asteroids.splice(index, 1); // Видалити, якщо вийшов за межі
      }
    });    
  });

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

checkCollisions(); // 🔥 Додаємо перевірку попадань

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

// function explodeProjectile(x, y) {
//   const explosion = new Image();
//   explosion.src = "assets/images/explosion.png"; // Шлях до спрайта вибуху
//   explosion.onload = () => {
//     ctx.drawImage(explosion, x, y, 50, 50); // Малюємо вибух
//     setTimeout(() => {
//       ctx.clearRect(x, y, 50, 50); // Очищаємо вибух через 0.3 секунди
//     }, 300);
//   };
// }

// function explodeProjectile(bullet) {
// bullet.image.src = "assets/images/explosion.png"; // Міняємо картинку на вибух
// bullet.width = 30;
// bullet.height = 30;
// bullet.explode(); // Викликаємо метод вибуху снаряда

// setTimeout(() => {
// bullets.splice(bullets.indexOf(bullet), 1); // Видаляємо кулю з масиву
// }, 300); // Вибух триває 0.3 секунди
// } // Вибух снаряда
