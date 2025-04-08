// public/store.jsstore.js — відповідає за:

//🎯 Покупки в магазині

//🔇 Налаштування звуку

//💾 Збереження стану гравця

export const store = {
  coins: 0,
  upgrades: {
    weapon: 1,
    shield: 0,
    speed: 1,
  },

  buyUpgrade(type) {
    const cost = this.upgrades[type] * 100;
    if (this.coins >= cost) {
      this.coins -= cost;
      this.upgrades[type]++;
      console.log(`✅ Куплено: ${type} ➡ рівень ${this.upgrades[type]}`);
    } else {
      console.log("🚫 Недостатньо монет");
    }
  },

  earnCoins(amount) {
    this.coins += amount;
    console.log(`💰 Отримано ${amount} монет`);
  },
};

const storeState = JSON.parse(localStorage.getItem("store")) || {
  weapons: ["basic"],
  coins: 0,
};

function buyUpgrade(upgradeName) {
  if (!storeState.weapons.includes(upgradeName)) {
    storeState.weapons.push(upgradeName);
    localStorage.setItem("store", JSON.stringify(storeState));
    console.log("🛒 Куплено:", upgradeName);
  }
}

const isMuted = JSON.parse(localStorage.getItem("mute")) || false;

function toggleSound() {
  const newValue = !isMuted;
  localStorage.setItem("mute", newValue);
  // Увімкнути / вимкнути аудіо
}
