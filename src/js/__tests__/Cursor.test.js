import Cursor from "../Cursor";

describe("Cursor", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    new Cursor();
  });

  test("Should create a div element with the custom-cursor class", () => {
    const cursorElement = document.querySelector(".custom-cursor");
    expect(cursorElement).not.toBeNull();
  });

  test("Should hide the default cursor", () => {
    expect(document.body.style.cursor).toBe("none");
  });

  test("Should move on mousemove event", () => {
    const cursorElement = document.querySelector(".custom-cursor");
    const event = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 200,
    });
    document.dispatchEvent(event);
    expect(cursorElement.style.left).toBe("100px");
    expect(cursorElement.style.top).toBe("200px");
  });

  test("Should not throw errors on mouse movement", () => {
    expect(() => {
      const event = new MouseEvent("mousemove", {
        clientX: 50,
        clientY: 60,
      });
      document.dispatchEvent(event);
    }).not.toThrow();
  });
});
