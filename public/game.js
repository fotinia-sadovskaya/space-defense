import Player from "./player.js";
import Enemy from "./enemy.js";
import Bullet from "./bullet.js";
import Asteroid from "./asteroid.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
const player = new Player(canvas);

document.addEventListener("keydown", (event) => {
  console.log("🟢 Натиснута клавіша:", event.key); // ✅ Лог кожної клавіші

  const key = event.key.toLowerCase(); // ✅ Приводимо до нижнього регістру

  if (key === "arrowleft") {
    player.move("left");
  }
  if (key === "arrowright") {
    player.move("right");
  }
  if (key === " ") {
    player.shoot();
  }
  if (key === "w") {
    console.log("🔫 W натиснута – викликаємо player.changeWeapon()"); // ✅ Перевіряємо, чи сюди взагалі доходить код
    player.changeWeapon();
  }
});

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.updateBullets();
  player.draw();
  requestAnimationFrame(updateGame);
}

updateGame();

async function setRandomBackground() {
  console.log("🌌 Починаємо встановлення фону...");
  try {
    const response = await fetch(
      "https://images-api.nasa.gov/search?q=galaxy&media_type=image"
    );
    const data = await response.json();
    console.log("🔍 Відповідь API NASA:", data); // ✅ Перевіряємо структуру

    // Фільтруємо тільки якісні фото галактик та туманностей
    const images = data.collection.items.filter((item) => {
      const description = item.data[0].description.toLowerCase();
      return (
        (description.includes("hubble") ||
          description.includes("james webb") ||
          description.includes("deep space")) &&
        !description.includes("illustration") && // Прибираємо малюнки
        !description.includes("infographic") && // Прибираємо графічні елементи
        !description.includes("composite") // Прибираємо складені фото
      );
    });

    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const imageUrl = images[randomIndex].links[0].href;
      console.log("🌌 Випадкове зображення:", imageUrl); // ✅ Перевіряємо URL

      document.getElementById(
        "gameCanvas"
      ).style.background = `url(${imageUrl}) center/cover no-repeat`;

      //document.body.style.background = `url(${imageUrl}) center/cover no-repeat`; // ✅ Ставимо фон у body
    } else {
      console.warn("⚠️ Немає відповідних зображень.");
      // Якщо не знайшли жодного зображення, можна поставити дефолтне
      document.body.style.background = `url('assets/images/default-bg.jpg') center/cover no-repeat`;
      console.log("🌌 Використано дефолтне зображення фону.");
    }
  } catch (error) {
    console.error("❌ Не вдалося завантажити фон з NASA API", error);
  }
}

// 🎯 Обсервер для відстеження змін стилю canvas
const observer = new MutationObserver(() => {
  console.log(
    "🎨 Canvas style змінився:",
    document.getElementById("gameCanvas").style.background
  );
});

// Стежимо за змінами атрибуту style у canvas
observer.observe(document.getElementById("gameCanvas"), {
  attributes: true,
  attributeFilter: ["style"],
});

setRandomBackground(); // Викликаємо функцію встановлення фону

const enemies = []; // Масив ворогів

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40); // Випадкова позиція
  const speed = 2 + Math.random() * 2; // Випадкова швидкість

  enemies.push(new Enemy(canvas, x, -50, speed)); // Додаємо ворога
}

// Викликаємо функцію кожні 2 секунди
setInterval(spawnEnemy, 2000);
