[![Deploy static content to Pages](https://github.com/fotinia-sadovskaya/space-defense/actions/workflows/static.yml/badge.svg)](https://github.com/fotinia-sadovskaya/space-defense/actions/workflows/static.yml)

# Space Defense 🚀🛡️

## Опис проєкту  

"Space Defense" - захоплююча аркадна гра, в якій гравці керують космічним кораблем, знищують астероїди, супутники та б'ються з босами. Покращуйте корабель, долайте хвилі ворогів і досягайте нових рекордів!

---

## Структура проєкту 📂

```plaintext

/space-defense  
│── /.github
│ │── /workflows
│ │ │── /deploy-html.yml
│── /public  
│ │── /assets  
│ │ │── /images (спрайти, іконки, бекграунди 💾)  
│ │ │── /sounds (музика та ефекти 🔊)  
│ │ │── /styles (CSS-оформлення 🎨)
│ │── /partials  
│ │ │── /ui-hud.partial.html (панель гравця 🧑🏆)  
│ │ │── /ui-profile.partial.html (панель профілю гравця  👤)  
│ │ │── /ui-store.partial.html (панель магазину 🛒)
│ │── /utils  
│ │ │── /notify.js (toast ✅ )  
│ │ │── /score.js (модуль для рахунку очок, рекордів і збереження у localStorage  🎯🏆)
│ │ │── /sound.js  (керування музикою та ефектами 🎧)  
│ │ │── /store.js  (керування сховищем гри  (localStorage) 💾🔇💰)
│ │── index.html (точка входу 🧠)
│ │── main.js (основна логіка запуску 🎮)  
│ │── game.js (ініціалізація гри та керування ігровим циклом 🕹️🔁)  
│ │── player.js (клас гравця 🚀)  
│ │── bullet.js (клас снарядів 🔫💥)
│ │── asteroid.js (клас астероідів 🌌)
│ │── enemy.js (клас ворогів 🤖🔥)  
│ │── boss.js (клас босів 👾)  
│ │── finalBoss.js (фінальний бос ♻️)  
│ │── ui.js (інтерфейс користувача: відображення очок, життя, екранів 📊🎁)
│ │── profile.js (профіль гравця 👩‍🚀)  
│ │── .nojekyll  
│── /server  
│ │── server.js (WebSockets-сервер 🌍)  
│── package.json  
│── README.md (документація проєкту 📊)

```

---

## 🔥 План реалізації гри

### 🎯 Вимоги та їх реалізація

| ✅ **Вимога**                 | 🛠 **Реалізація**                                      |
|-------------------------------|--------------------------------------------------------|
| Події для взаємодії з         | Клавіші керування кораблем (стрілки/WASD),             |
| користувачем                  | стрілянина (пробіл), зміна зброї (W),  магазин (М)     |
| Динамічна зміна DOM           | Анімація пострілів, вибухів, руху ворогів              |
| OOP (класи, методи, get/set)  | Класи: `Player`, `Enemy`, `Bullet`, `Boss`             |
| Асинхронний код               | setInterval(), requestAnimationFrame() для анімації    |
| Запити до API                 | NASA API — випадковий фон з космосу                    |
| Сховища даних                 |`localStorage` для збереження очок та рекордів          |
| Сучасні функції ES6           | `map()`, `filter()`, деструктуризація, spread-оператор |

---

### 🎮 Функціонал гри

| 📌 **Функція**                | 🎯 **Опис**                                                 |
|--------------------------------|-------------------------------------------------------------|
| 🚀 Керування кораблем         | Клавіші стрілки/WASD, стрілянина (пробіл), зміна зброї (W)   |
| 💥 Стрілянина                 | Різні види зброї (звичайні, лазери, ракети)                  |
| 🎁 Бонуси                     | Покращення зброї, щити, збільшення швидкості                 |
| 🔥 Хвилі ворогів              | Спавн ворогів кожні N секунд                                 |
| 👾 Боси                       | Складні вороги з унікальними атаками                         |
| ♻️ Фінальний бос              | Візуально відрізняється, має фази, складну поведінку         |
| 🎯 Підрахунок очок            | Очки за кожного ворога, збереження рекордів у `localStorage` |
| 🛒 Магазин                    | Покращення зброї, купівля життів за очки                     |

---

### ✅ Що вже реалізовано

| ✅ **Вимога**                   | 🛠 **Реалізація**                                    |  ✅ |
|---------------------------------|------------------------------------------------------|------|
| 🎮 Події для взаємодії          | keydown для керування                                |  ✅ |
| 🧱 Динамічна зміна DOM          | вибухи, canvas, снаряди                              |  ✅ |
| 🧠 OOP (класи, методи, get/set) | Player, Enemy, Bullet і т.д.                         |  ✅ |
|  🔁 Асинхронний код             | фон з NASA API через fetch                           |  ✅ |
| 🌐 Запити на сервер (API)       | NASA API                                             |  ✅ |
| 💾 Сховища даних                | наприклад, highscore або налаштування                |  ✅ |
| ⚙️ ES6 фічі                     | destructuring, spread, map, forEach використовуються |  ✅ |

---

## 📌 Як це працює?

- стрілки вліво/вправо → рухаємо корабель
- пробіл → стріляємо
- "W" → міняємо зброю (normal - "yellow", strong - "red", laser - "cyan")
- Логіка стрільби додана в gameLoop()

---

## 📌 Запуск


### Встановлення залежностей

```bash
npm install
```
### Запуск WebSocket-сервера

```bash
node server/server.js
```

# Space Defense 🚀🛡️

An arcade browser game: pilot a spaceship, destroy asteroids and enemy ships,
and fight bosses through waves of enemies.

**[▶ Play online](https://fotinia-sadovskaya.github.io/space-defense/)** · Status: prototype in progress

![Gameplay screenshot](docs/screenshot.png)

## Controls
- Arrow keys / WASD: move
- Space: shoot
- W: switch weapon · M: open shop

## Tech stack
JavaScript (ES6, classes), HTML5 Canvas, CSS, NASA API (background), localStorage (high scores),
GitHub Pages + GitHub Actions (deployment).

## Features
- [x] Player ship, bullets, asteroids, enemies, bosses
- [x] Dynamic NASA background
- [ ] Shop and upgrades
- [ ] Final boss phases

## Run locally
npm install
npm start   (або відкрийте public/index.html)
