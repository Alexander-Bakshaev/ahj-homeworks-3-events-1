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
    // Clear existing grid
    grid.innerHTML = '';
    this.cells = [];

    // Create grid cells
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
    // Clear any existing timeouts/intervals
    clearTimeout(this.moveTimeout);
    clearInterval(this.interval);

    // Reset game state
    this.scoreboard.reset();
    this.misses = 0;
    this.scoreboard.updateMisses(this.misses);

    // Remove goblin if it exists
    if (this.currentPosition !== -1 && this.cells[this.currentPosition]) {
      const currentCell = this.cells[this.currentPosition];
      const goblinElement = currentCell.querySelector('.goblin');
      if (goblinElement) {
        currentCell.removeChild(goblinElement);
      }
      this.currentPosition = -1;
    }

    // Start the game loop
    this.interval = setInterval(() => this.gameLoop(), 1000);
  }

  gameLoop() {
    // If goblin is already on the field, count it as a miss
    if (this.currentPosition !== -1) {
      this.misses++;
      this.scoreboard.updateMisses(this.misses);

      // Remove the goblin from the current position
      const currentCell = this.cells[this.currentPosition];
      const goblinElement = currentCell.querySelector('.goblin');
      if (goblinElement) {
        currentCell.removeChild(goblinElement);
      }
      this.currentPosition = -1;

      // Check for game over
      if (this.misses >= this.maxMisses) {
        this.endGame();
        return;
      }
    }

    // Move the goblin to a new position
    this.moveGoblin();

    // Set a timeout to remove the goblin after 1 second
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
    // Find a new random position that's different from the current one
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * this.cells.length);
    } while (newPosition === this.currentPosition && this.cells.length > 1);

    // Remove goblin from current position
    if (this.currentPosition !== -1 && this.cells[this.currentPosition]) {
      const currentCell = this.cells[this.currentPosition];
      const goblinElement = currentCell.querySelector('.goblin');
      if (goblinElement) {
        currentCell.removeChild(goblinElement);
      }
    }

    // Add goblin to new position
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
      // Clicked on a goblin - score a point
      this.scoreboard.updateScore();
      // Remove the goblin immediately
      cell.removeChild(goblin);
      this.currentPosition = -1;
      // Clear the timeout since we're removing the goblin manually
      clearTimeout(this.moveTimeout);
    }
  }

  endGame() {
    clearInterval(this.interval);
    clearTimeout(this.moveTimeout);

    // Remove the goblin from the board
    if (this.currentPosition !== -1 && this.cells[this.currentPosition]) {
      const currentCell = this.cells[this.currentPosition];
      const goblinElement = currentCell.querySelector('.goblin');
      if (goblinElement) {
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
