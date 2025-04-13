//score.js — модуль для рахунку очок, рекордів і збереження у localStorage
//для таблиці лідерів 🌟

export function getScore() {
  return Number(localStorage.getItem("score") || 0);
}
// 🧮 Повертає рекорд з localStorage
export function getHighScore() {
  return Number(localStorage.getItem("highscore") || 0);
}
// export const getHighScore = () => {
//   return localStorage.getItem("highscore") || 0;
// };

// 💾 Зберігає новий рекорд, якщо вищий
export function updateScore(score) {
  localStorage.setItem("score", score);
}
// export const updateScore = (newScore) => {
//   const highScore = getHighScore();
//   if (newScore > highScore) {
//     localStorage.setItem("highscore", newScore);
//     console.log("🏆 Новий рекорд:", newScore);
//   }
// };

// 📊 Оновлює UI з рекордом
export function updateHighScoreUI() {
  const highscore = getHighScore();
  const span = document.getElementById("highscore");
  if (span) span.textContent = highscore;
}
// export const updateHighScoreUI = () => {
//   const highScoreEl = document.getElementById("highscore");
//   if (highScoreEl) {
//     highScoreEl.textContent = getHighScore();
//   }
// };
