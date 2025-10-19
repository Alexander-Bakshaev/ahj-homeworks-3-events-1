import goblinImage from "../img/goblin.png";
import Scoreboard from "./Scoreboard";
import Cursor from "./Cursor";

class GoblinGame {
  constructor() {
    this.gridSize = 4;
    this.cells = [];
    this.goblin = document.createElement("img");
    this.goblin.src = goblinImage;
    this.goblin.classList.add("goblin");
    this.currentPosition = -1;
    this.misses = 0;
    this.maxMisses = 5;
    this.scoreboard = new Scoreboard();
    this.cursor = new Cursor();
    this.moveTimeout = null;
    this.interval = null;
  }

  init() {
    const grid = document.querySelector(".game-grid");
    // Очистка игрового поля
    grid.innerHTML = '';
    this.cells = [];

    // Создание ячеек игрового поля
    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      grid.appendChild(cell);
      this.cells.push(cell);

      cell.addEventListener("click", (event) => this.handleClick(event));
    }

    this.startNewGame();
  }

  startNewGame() {
    // Очистка всех таймеров и интервалов
    clearTimeout(this.moveTimeout);
    clearInterval(this.interval);

    // Сброс состояния игры
    this.scoreboard.reset();
    this.misses = 0;
    this.scoreboard.updateMisses(this.misses);

    // Удаление гоблина, если он существует
    if (this.currentPosition !== -1 && this.cells[this.currentPosition]) {
      const currentCell = this.cells[this.currentPosition];
      const goblinElement = currentCell.querySelector('.goblin');
      if (goblinElement) {
        currentCell.removeChild(goblinElement);
      }
      this.currentPosition = -1;
    }

    // Запуск игрового цикла
    this.interval = setInterval(() => this.gameLoop(), 1000);
  }

  gameLoop() {
    // Если гоблин уже на поле, засчитываем промах
    if (this.currentPosition !== -1) {
      this.misses++;
      this.scoreboard.updateMisses(this.misses);

      // Удаление гоблина с текущей позиции
      const currentCell = this.cells[this.currentPosition];
      const goblinElement = currentCell.querySelector('.goblin');
      if (goblinElement) {
        currentCell.removeChild(goblinElement);
      }
      this.currentPosition = -1;

      // Проверка на конец игры
      if (this.misses >= this.maxMisses) {
        this.endGame();
        return;
      }
    }

    // Перемещение гоблина на новую позицию
    this.moveGoblin();

    // Установка таймера для удаления гоблина через 1 секунду
    clearTimeout(this.moveTimeout);
    this.moveTimeout = setTimeout(() => {
      if (this.currentPosition !== -1) {
        this.cells.forEach(cell => {
          const goblin = cell.querySelector('.goblin');
          if (goblin) {
            cell.removeChild(goblin);
          }
        });
        this.currentPosition = -1;
      }
    }, 1000);
  }

  moveGoblin() {
    if (this.cells.length === 0) return; // Проверка на пустой массив ячеек

    // Поиск новой случайной позиции, отличной от текущей
    let newPosition;
    let attempts = 0;
    do {
      newPosition = Math.floor(Math.random() * this.cells.length);
      attempts++;
      if (attempts > 100) break; // Защита от бесконечного цикла
    } while (newPosition === this.currentPosition && this.cells.length > 1);

    // Удаление гоблина с текущей позиции
    if (this.currentPosition !== -1 && this.cells[this.currentPosition]) {
      const currentCell = this.cells[this.currentPosition];
      const goblinElement = currentCell.querySelector('.goblin');
      if (goblinElement && currentCell.contains(goblinElement)) {
        currentCell.removeChild(goblinElement);
      }
    }

    // Добавление гоблина на новую позицию
    const newCell = this.cells[newPosition];
    if (newCell) {
      newCell.appendChild(this.goblin);
      this.currentPosition = newPosition;
    }
  }

  handleClick(event) {
    const cell = event.target.closest('.cell');
    if (!cell) return;

    const goblin = cell.querySelector('.goblin');
    if (goblin) {
      // Попадание по гоблину - начисление очка
      this.scoreboard.updateScore();
      // Немедленное удаление гоблина
      cell.removeChild(goblin);
      this.currentPosition = -1;
      // Очистка таймаута, так как гоблин удален вручную
      clearTimeout(this.moveTimeout);
    }
  }

  endGame() {
    // Очистка всех ожидающих операций
    if (this.interval) clearInterval(this.interval);
    if (this.moveTimeout) clearTimeout(this.moveTimeout);

    // Удаление гоблина с доски, если он существует
    if (this.currentPosition !== -1 && this.cells[this.currentPosition]) {
      const currentCell = this.cells[this.currentPosition];
      const goblinElement = currentCell.querySelector('.goblin');
      if (goblinElement && currentCell.contains(goblinElement)) {
        currentCell.removeChild(goblinElement);
      }
      this.currentPosition = -1;
    }

    setTimeout(() => {
      if (confirm(`Игра окончена! Ваш результат: ${this.scoreboard.score}\n\nХотите сыграть снова?`)) {
        this.startNewGame();
      }
    }, 100);
  }
}

export default GoblinGame;
