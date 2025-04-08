export const getHighScore = () => {
  return localStorage.getItem("highscore") || 0;
};

export const updateScore = (newScore) => {
  const highScore = getHighScore();
  if (newScore > highScore) {
    localStorage.setItem("highscore", newScore);
    console.log("🏆 Новий рекорд:", newScore);
  }
};

export const updateHighScoreUI = () => {
  const highScoreEl = document.getElementById("highscore");
  if (highScoreEl) {
    highScoreEl.textContent = getHighScore();
  }
};
