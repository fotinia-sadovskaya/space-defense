// utils/score.js — модуль для рахунку очок, рекордів і збереження
// у localStorage для таблиці лідерів 🌟

// ✅ Отримати очки з localStorage
export function getScore() {
  return Number(localStorage.getItem("score") || 0);
}
// 🧮 Повертає рекорд з localStorage
export function getHighScore() {
  return Number(localStorage.getItem("highscore") || 0);
}

// 💾 Зберігає новий рекорд, якщо вищий
export function updateScore(score) {
  localStorage.setItem("score", score);

  // Перевірка та оновлення рекорду
  const high = getHighScore();
  if (score > high) {
    localStorage.setItem("highscore", score);
    console.log("🏆 Новий рекорд:", score);
  }
}

// 📊 Оновлює UI з рекордом
export function updateHighScoreUI() {
  const highscore = getHighScore();
  const span = document.getElementById("highscore");
  if (span) span.textContent = highscore;
}
