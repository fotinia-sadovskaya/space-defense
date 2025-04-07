import Bullet from "./bullet.js";

export default class Player {
  constructor(canvas, bullets) {
    this.canvas = canvas;
    // 🔥 Додаємо перевірку наявності canvas
    if (!canvas) {
      console.error("❌ Помилка! canvas не передано в Player!");
      return;
    }
    // ✅ Ініціалізація гравця
    this.ctx = canvas.getContext("2d");
    // 🔥 Додаємо перевірку наявності контексту
    if (!canvas.getContext) {
      console.error("❌ Помилка! canvas не підтримує getContext!");
      return;
    }
    // 🔥 Додаємо перевірку наявності контексту 2D
    if (!canvas.getContext("2d")) {
      console.error("❌ Помилка! canvas не підтримує 2D контекст!");
      return;
    }
    this.bullets = bullets; // 🔥 Посилання на зовнішній масив
    // 🔍 Дивимося, чи масив коректний
    console.log("🛠️ Player створено, bullets:", this.bullets);
    if (!Array.isArray(this.bullets)) {
      console.error("❌ Помилка! bullets не є масивом:", this.bullets);
      this.bullets = []; // Якщо що, створюємо новий масив
    } else {
      console.log("✅ Масив bullets коректний:", this.bullets);
    }

    // ✅ Ініціалізація корабля
    this.width = 100; // Ширина корабля
    this.height = 100; // Висота корабля
    this.x = canvas.width / 2 - this.width / 2; // Позиція по X
    this.y = canvas.height - this.height - 20; // Позиція по Y
    this.speed = 15; // Швидк ість руху корабля

    this.image = new Image(); // Створюємо новий об'єкт зображення
    this.image.src = "assets/images/ship.png"; // Корабель гравця - Шлях до зображення корабля
    this.image.onload = () => console.log("🖼 Корабель завантажився успішно!");
    this.image.onerror = () =>
      console.error("❌ Помилка завантаження ship.png!"); // Обробка помилки завантаження зображення

    // this.bullets = []; // Масив для куль
    // ✅ Ініціалізація зброї
    this.weaponTypes = ["normal", "strong", "laser"];
    this.weaponIndex = 0; // 🔥 Виправлено: Початковий індекс

    console.log(
      "🔧 Player створено. Початкова зброя:",
      this.weaponTypes[this.weaponIndex]
    );
  }

  move(direction) {
    if (direction === "left" && this.x > 0) {
      this.x -= this.speed;
    }
    if (direction === "right" && this.x + this.width < this.canvas.width) {
      this.x += this.speed;
    }
  }

  shoot() {
    const currentWeapon = this.weaponTypes[this.weaponIndex];

    // 🔴 Перевіряємо, чи зброя існує
    if (!currentWeapon) {
      console.error(
        "❌ Помилка! currentWeapon = undefined, weaponIndex =",
        this.weaponIndex
      );
      return;
    }

    console.log(`🚀 Вогонь! (${currentWeapon})`); // 🔥 Лог при стрільбі

    const bullet = new Bullet(
      this.canvas,
      this.x + this.width / 2,
      this.y,
      currentWeapon
    );
    this.bullets.push(bullet); // ✅ Додаємо кулю у спільний масив
    console.log("🎯 Куля створена:", bullet); // 🔥 Лог для перевірки
  }

  changeWeapon() {
    console.log(
      "🔄 Перед зміною:",
      this.weaponIndex,
      this.weaponTypes[this.weaponIndex]
    );

    // ✅ Фікс проблеми: переконуємось, що weaponIndex – число
    if (typeof this.weaponIndex !== "number" || isNaN(this.weaponIndex)) {
      console.error("❌ Помилка! weaponIndex некоректний:", this.weaponIndex);
      this.weaponIndex = 0; // 🔥 Виправлення: якщо щось пішло не так – повертаємось до нормальної зброї
    }

    this.weaponIndex = (this.weaponIndex + 1) % this.weaponTypes.length;

    console.log(
      "✅ Після зміни:",
      this.weaponIndex,
      this.weaponTypes[this.weaponIndex]
    );
  }

  updateBullets() {
    this.bullets.forEach((bullet, index) => {
      bullet.move();
      if (bullet.isOutOfScreen()) {
        this.bullets.splice(index, 1);
      }
    });
  }

  draw() {
    if (!this.ctx) {
      console.error("❌ Player: немає контексту малювання!");
      return;
    }
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.bullets.forEach((bullet) => bullet.draw());
  }
}
