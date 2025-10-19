class Cursor {
  constructor() {
    this.cursor = document.createElement("div");
    this.cursor.classList.add("custom-cursor");
    document.body.appendChild(this.cursor);
    document.body.style.cursor = "none";

    // Состояние анимации
    this.isAnimating = false;

    // Добавляем обработчики событий
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Плавное перемещение курсора
    document.addEventListener("mousemove", (e) => this.moveCursor(e));

    // Обработка кликов
    document.addEventListener("mousedown", (e) => this.handleMouseDown(e));

    // Сброс анимации после завершения
    this.cursor.addEventListener('animationend', () => {
      this.cursor.classList.remove("hit");
      this.isAnimating = false;
    });
  }

  moveCursor(event) {
    if (this.isAnimating) return;

    this.cursor.style.left = `${event.clientX}px`;
    this.cursor.style.top = `${event.clientY}px`;
  }

  handleMouseDown(event) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.cursor.classList.add("hit");

    // Обновляем позицию курсора в момент клика
    this.cursor.style.left = `${event.clientX}px`;
    this.cursor.style.top = `${event.clientY}px`;
  }
}

export default Cursor;
