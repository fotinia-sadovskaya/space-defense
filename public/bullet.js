export default class Bullet {
  // Додаємо експортування класу
  constructor(canvas, x, y, type = "normal") {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.type = type;

    if (this.type === "normal") {
      this.speed = 7; // Швидкість руху кулі
      this.damage = 1;
      this.width = 5;
      this.height = 15;
      this.color = "yellow";
    } else if (this.type === "strong") {
      this.speed = 5;
      this.damage = 3;
      this.width = 10;
      this.height = 25;
      this.color = "red";
    } else if (this.type === "laser") {
      this.speed = 10;
      this.damage = 5;
      this.width = 3;
      this.height = 30;
      this.color = "cyan";
    }
  }

  move() {
    this.y -= this.speed; // ✅ Куля має рухатись вгору (зменшуємо y)
    console.log(`🚀 Куля рухається: ${this.y}`); // Лог перевірки
  }

  draw() {
    this.ctx.fillStyle = this.color; // Колір кулі
    this.ctx.fillRect(this.x, this.y, this.width, this.height); // Малюємо кулю
    console.log("🎨 Малюємо кулю на позиції:", this.x, this.y); // Лог для перевірки
  }

  isOutOfScreen() {
    return this.y < 0;
  }

  explode() {
    this.image.src = "assets/images/explosion.png"; // Міняємо картинку на вибух
    this.width = 30;
    this.height = 30;

    setTimeout(() => {
      this.remove = true; // Позначаємо, що снаряд треба видалити
    }, 300); // 0.3 секунди тримається вибух
  } // Вибух снаряда
}
