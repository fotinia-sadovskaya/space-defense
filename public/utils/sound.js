export function playSound(name = "buy") {
  const sounds = {
    buy: new Audio("assets/sounds/buy.wav"),
    shoot: new Audio("assets/sounds/shoot.wav"),
    alert: new Audio("assets/sounds/alert.wav"),
    toggle: new Audio("assets/sounds/toggle.wav"),
  };

  if (sounds[name]) {
    sounds[name].volume = 0.5;
    sounds[name]
      .play()
      .catch((err) => console.warn("🔇 Звук не відтворено", err));
  }
}
