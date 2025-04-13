export function showToast(message = "✅ Готово", duration = 2000) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  // Додаємо toast до body
  document.body.appendChild(toast);

  // Анімація появи
  setTimeout(() => {
    toast.classList.add("toast--visible");
  }, 10);

  // Анімація зникнення
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
