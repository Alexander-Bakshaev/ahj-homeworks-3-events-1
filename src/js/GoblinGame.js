import goblinImage from "../img/goblin.png";
import Scoreboard from "./Scoreboard";
import Cursor from "./Cursor";

class GoblinGame {
  constructor() {
    // Основные настройки игры
    this.gridSize = 4;  // Размер игрового поля (4x4)
    this.cells = [];    // Массив ячеек игрового поля
    this.currentPosition = -1;  // Текущая позиция гоблина (-1 - гоблин не на поле)
    this.misses = 0;            // Количество промахов
    this.maxMisses = 5;         // Максимальное количество промахов до конца игры
    this.lastMoveTime = 0;      // Время последнего перемещения гоблина

    // Инициализация компонентов
    this.scoreboard = new Scoreboard();  // Таблица очков
    this.cursor = new Cursor();          // Кастомный курсор

    // Создание элемента гоблина
    this.goblin = document.createElement("img");
    Object.assign(this.goblin, {
      src: goblinImage, alt: "Гоблин"
    });
    this.goblin.classList.add("goblin");

    this.moveTimeout = null;  // Таймер для задержки хода
    this.interval = null;     // Интервал для игрового цикла
  }

  /**
   * Инициализация игрового поля и начало новой игры
   */
  init() {
    const grid = document.querySelector(".game-grid");
    grid.innerHTML = "";  // Очищаем игровое поле

    // Создаем ячейки игрового поля
    this.cells = Array.from({length: this.gridSize ** 2}, (_, i) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = i;
      cell.addEventListener("click", (e) => this.handleClick(e));
      grid.append(cell);
      return cell;
    });

    this.startNewGame();
  }

  startNewGame() {
    this.clearTimers();

    this.scoreboard.reset();
    this.misses = 0;
    this.scoreboard.updateMisses(this.misses);
    this.removeGoblin();

    this.interval = setInterval(() => this.gameLoop(), 1000);
  }

  clearTimers() {
    clearTimeout(this.moveTimeout);
    clearInterval(this.interval);
  }

  removeGoblin() {
    if (this.currentPosition === -1) return;
    const cell = this.cells[this.currentPosition];
    cell?.querySelector(".goblin")?.remove();
    this.currentPosition = -1;
  }

  /**
   * Основной игровой цикл
   */
  gameLoop() {
    // Проверяем, не упустили ли мы гоблина в предыдущем ходе
    if (this.currentPosition !== -1) {
      this.misses++;
      this.scoreboard.updateMisses(this.misses);
      this.removeGoblin();

      // Завершаем игру при достижении максимального числа промахов
      if (this.misses >= this.maxMisses) return this.endGame();
    }

    // Перемещаем гоблина и обновляем время последнего хода
    this.moveGoblin();
    this.lastMoveTime = Date.now();

    // Устанавливаем таймер для следующего хода
    clearTimeout(this.moveTimeout);
    this.moveTimeout = setTimeout(() => {
      if (this.currentPosition !== -1) {
        this.removeGoblin();
        if (this.misses < this.maxMisses) this.gameLoop();
      }
    }, 1000);
  }

  /**
   * Перемещает гоблина в случайную ячейку, отличную от текущей
   */
  moveGoblin() {
    if (!this.cells.length) return;

    // Получаем все возможные позиции, исключая текущую
    const availablePositions = this.cells
      .map((_, i) => i)
      .filter((i) => i !== this.currentPosition);

    // Выбираем случайную позицию из доступных
    const newPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    const newCell = this.cells[newPosition];

    // Перемещаем гоблина в новую ячейку
    newCell.append(this.goblin);
    this.currentPosition = newPosition;
  }

  /**
   * Обработчик клика по ячейке
   * @param {Event} event - Событие клика
   */
  handleClick(event) {
    const cell = event.target.closest(".cell");
    if (!cell?.querySelector(".goblin")) return;  // Пропускаем клик, если в ячейке нет гоблина

    // Обработка попадания
    this.scoreboard.updateScore();
    clearTimeout(this.moveTimeout);
    this.removeGoblin();

    // Рассчитываем задержку до следующего хода
    const timeElapsed = Date.now() - this.lastMoveTime;
    const delay = Math.max(1000 - timeElapsed, 0);

    // Продолжаем игру, если еще есть попытки
    if (this.misses < this.maxMisses) {
      this.moveTimeout = setTimeout(() => this.gameLoop(), delay);
    }
  }

  endGame() {
    this.clearTimers();
    this.removeGoblin();

    const modal = document.getElementById("gameModal");
    const finalScore = document.getElementById("finalScore");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");

    finalScore.textContent = this.scoreboard.score;

    modal.style.display = "flex";
    requestAnimationFrame(() => modal.classList.add("show"));

    const closeModal = () => {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    };

    const playAgain = () => {
      closeModal();
      this.startNewGame();
    };

    playAgainBtn.replaceWith(playAgainBtn.cloneNode(true));
    closeModalBtn.replaceWith(closeModalBtn.cloneNode(true));

    document.getElementById("playAgainBtn").addEventListener("click", playAgain);
    document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  }
}

export default GoblinGame;
