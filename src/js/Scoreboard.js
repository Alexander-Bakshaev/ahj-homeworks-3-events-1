class Scoreboard {
  constructor() {
    this.score = 0;
    this.misses = 0;
    this.scoreElement = document.getElementById("score");
    this.missesElement = document.getElementById("misses");
  }

  updateScore() {
    this.score += 1;
    this.scoreElement.textContent = this.score;
  }

  updateMisses(misses) {
    this.misses = misses;
    this.missesElement.textContent = this.misses;
  }

  reset() {
    this.score = 0;
    this.misses = 0;
    this.scoreElement.textContent = this.score;
    this.missesElement.textContent = this.misses;
  }
}

export default Scoreboard;
