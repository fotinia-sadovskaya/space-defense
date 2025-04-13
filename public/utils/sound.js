const sounds = {
  shoot: new Audio("assets/sounds/shoot.wav"),
  explode: new Audio("assets/sounds/explosion.wav"),
  buy: new Audio("assets/sounds/buy.wav"),
  toggle: new Audio("assets/sounds/toggle.wav"),
};

export function playSound(name) {
  if (!localStorage.getItem("mute")) {
    sounds[name]?.play();
  }
}

export function toggleSound() {
  const current = localStorage.getItem("mute") === "true";
  const updated = !current;
  localStorage.setItem("mute", updated);
  return updated;
}
