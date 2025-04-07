export default class Asteroid {
  constructor(canvas, x, y, speed) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.x = x;
    this.y = y;
    this.speed = speed || 1 + Math.random() * 3;
    this.width = 60;
    this.height = 60;

    this.image = new Image();
    this.image.src = "assets/images/asteroid.png"; // Додайте астероїд у папку images
    this.image.onload = () => console.log("🪨 Астероїд завантажено");
  }

  move() {
    this.y += this.speed;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
