import Scoreboard from "../Scoreboard";

describe("Scoreboard", () => {
  let scoreboardInstance;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="score"></div>
      <div id="misses"></div>
    `;
    scoreboardInstance = new Scoreboard();
  });

  test("Should initialize score and misses", () => {
    expect(scoreboardInstance.score).toBe(0);
    expect(scoreboardInstance.misses).toBe(0);
    expect(scoreboardInstance.scoreElement.textContent).toBe("");
    expect(scoreboardInstance.missesElement.textContent).toBe("");
  });

  test("Should update the score when updateScore is called", () => {
    scoreboardInstance.updateScore();
    expect(scoreboardInstance.score).toBe(1);
    expect(scoreboardInstance.scoreElement.textContent).toBe("1");
    scoreboardInstance.updateScore();
    expect(scoreboardInstance.score).toBe(2);
    expect(scoreboardInstance.scoreElement.textContent).toBe("2");
  });

  test("Should update the misses when updateMisses is called", () => {
    scoreboardInstance.updateMisses(3);
    expect(scoreboardInstance.misses).toBe(3);
    expect(scoreboardInstance.missesElement.textContent).toBe("3");
    scoreboardInstance.updateMisses(5);
    expect(scoreboardInstance.misses).toBe(5);
    expect(scoreboardInstance.missesElement.textContent).toBe("5");
  });

  test("Should reset score and misses to zero when reset is called", () => {
    scoreboardInstance.updateScore();
    scoreboardInstance.updateMisses(4);
    scoreboardInstance.reset();
    expect(scoreboardInstance.score).toBe(0);
    expect(scoreboardInstance.misses).toBe(0);
    expect(scoreboardInstance.scoreElement.textContent).toBe("0");
    expect(scoreboardInstance.missesElement.textContent).toBe("0");
  });
});
