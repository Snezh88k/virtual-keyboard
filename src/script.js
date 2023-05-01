import layout from "./layout.json" assert { type: "json" };

const body = document.querySelector("body");
const textarea = document.createElement("textarea");
const keyboard = document.createElement("div");
const title = document.createElement("h1");
const description = document.createElement("div");
keyboard.classList.add("keyboard");
textarea.classList.add("textarea");
description.classList.add("description");

title.innerText = "Virtual Keyboard";

body.appendChild(title);
body.appendChild(textarea);
body.appendChild(keyboard);
body.appendChild(description);

description.innerHTML =
  "<div><span>The keyboard was created in the Windows.</span><br><span>To switch the language: left CTRL + left ALT</span></div>";

window.addEventListener("click", (e) => {
  textarea.focus();
});

let language = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";

let shiftActive = false;
let capsLockActive = false;

function interactiveClick(elem) {
  elem.classList.add("active");
  setTimeout(() => {
    elem.classList.remove("active");
  }, 400);
}

//Работа капса

const makeCapsKey = () => {
  for (let i = 0; i < keys.length; i++) {
    if (language === "ru") {
      if (capsLockActive && layout[i].capsRu) {
        if (layout[i].ru_shift) {
          keys[i].innerHTML = layout[i].ru_shift;
          keys[i].setAttribute("value", layout[i].ru_shift);
        } else {
          keys[i].innerHTML = layout[i].ru;
          keys[i].setAttribute("value", layout[i].ru);
        }
      } else {
        keys[i].innerHTML = layout[i].ru;
        keys[i].setAttribute("value", layout[i].ru);
      }
    } else {
      if (capsLockActive && layout[i].capsEn) {
        if (layout[i].en_shift) {
          keys[i].innerHTML = layout[i].en_shift;
          keys[i].setAttribute("value", layout[i].en_shift);
        } else {
          keys[i].innerHTML = layout[i].ru;
          keys[i].setAttribute("value", layout[i].ru);
        }
      } else {
        keys[i].innerHTML = layout[i].en;
        keys[i].setAttribute("value", layout[i].en);
      }
    }
  }
};

//Работа шифта

const makeValueKey = () => {
  for (let i = 0; i < keys.length; i++) {
    if (language === "ru") {
      if (shiftActive) {
        if (capsLockActive && layout[i].capsRu) {
          keys[i].innerHTML = layout[i].ru;
          keys[i].setAttribute("value", layout[i].ru);
        }

        if (capsLockActive && !layout[i].capsRu && layout[i].ru_shift) {
          keys[i].innerHTML = layout[i].ru_shift;
          keys[i].setAttribute("value", layout[i].ru_shift);
        }

        if (!capsLockActive && layout[i].ru_shift) {
          keys[i].innerHTML = layout[i].ru_shift;
          keys[i].setAttribute("value", layout[i].ru_shift);
        }
      } else {
        if (capsLockActive && layout[i].capsRu) {
          keys[i].innerHTML = layout[i].ru_shift;
          keys[i].setAttribute("value", layout[i].ru_shift);
        }
        if (capsLockActive && !layout[i].capsRu) {
          keys[i].innerHTML = layout[i].ru;
          keys[i].setAttribute("value", layout[i].ru);
        }
        if (!capsLockActive) {
          keys[i].innerHTML = layout[i].ru;
          keys[i].setAttribute("value", layout[i].ru);
        }
      }
    } else {
      if (shiftActive) {
        if (capsLockActive && layout[i].capsEn) {
          keys[i].innerHTML = layout[i].en;
          keys[i].setAttribute("value", layout[i].en);
        }

        if (capsLockActive && !layout[i].capsEn && layout[i].en_shift) {
          keys[i].innerHTML = layout[i].en_shift;
          keys[i].setAttribute("value", layout[i].en_shift);
        }

        if (!capsLockActive && layout[i].en_shift) {
          keys[i].innerHTML = layout[i].en_shift;
          keys[i].setAttribute("value", layout[i].en_shift);
        }
      } else {
        if (capsLockActive && layout[i].capsEn) {
          keys[i].innerHTML = layout[i].en_shift;
          keys[i].setAttribute("value", layout[i].en_shift);
        }
        if (capsLockActive && !layout[i].capsEn) {
          keys[i].innerHTML = layout[i].en;
          keys[i].setAttribute("value", layout[i].en);
        }
        if (!capsLockActive) {
          keys[i].innerHTML = layout[i].en;
          keys[i].setAttribute("value", layout[i].en);
        }
      }
    }
  }
};

// Создание кнопки

const makeKey = (value) => {
  const { ru, en, type, eCode } = value;

  const key = document.createElement("div");
  keyboard.appendChild(key);
  key.classList.add("key");
  key.classList.add(type);
  key.setAttribute("keyValueRu", ru);
  key.setAttribute("keyValueEn", en);
  key.setAttribute("keyType", type);
  key.setAttribute("eCode", eCode);

  if (language === "ru") {
    key.innerText = ru;
    key.setAttribute("value", ru);
  } else {
    key.innerText = en;
    key.setAttribute("value", en);
  }
};

const makeKeyboard = () => {
  for (let i = 0; i < layout.length; i++) {
    makeKey(layout[i]);
  }
};

makeKeyboard();

const keys = document.querySelectorAll(".key");

//Добавление стилей на кнопки при нажатии

window.addEventListener("keydown", (e) => {
  textarea.focus();

  for (let i = 0; i < keys.length; i++) {
    if (e.code === keys[i].getAttribute("ecode")) {
      keys[i].classList.add("active");
    }
  }
});

//Удаление стилей на кнопки

window.addEventListener("keyup", (e) => {
  for (let i = 0; i < keys.length; i++) {
    if (e.code === keys[i].getAttribute("eCode")) {
      keys[i].classList.remove("active");
    }
  }
});

//Фунционал кнопок ввода символов

const standartKeys = document.querySelectorAll('[keyType="standart"]');

for (let i = 0; i < standartKeys.length; i++) {
  standartKeys[i].addEventListener("mousedown", (e) => {
    e.preventDefault();
    textarea.focus();

    let pointer = textarea.selectionStart;

    textarea.value =
      textarea.value.slice(0, pointer) +
      standartKeys[i].getAttribute("value") +
      textarea.value.slice(pointer, textarea.value.length);

    textarea.selectionStart = pointer + 1;
    textarea.selectionEnd = pointer + 1;

    interactiveClick(standartKeys[i]);
  });
}

window.addEventListener("keydown", (e) => {
  for (let i = 0; i < keys.length; i++) {
    if (
      e.code === keys[i].getAttribute("eCode") &&
      keys[i].getAttribute("keyType") === "standart"
    ) {
      e.preventDefault();
      let pointer = textarea.selectionStart;
      textarea.value =
        textarea.value.slice(0, pointer) +
        keys[i].getAttribute("value") +
        textarea.value.slice(pointer, textarea.value.length);

      textarea.selectionStart = pointer + 1;
      textarea.selectionEnd = pointer + 1;
    }
  }
});

//Функционал кнопки "Backspace"

const backspace = document.querySelector('[keyType="Backspace"]');
backspace.addEventListener("mousedown", () => {
  interactiveClick(backspace);

  let pointer = textarea.selectionStart;

  if (textarea.selectionStart === textarea.selectionEnd) {
    if (pointer === 0) {
      return;
    }
    textarea.value =
      textarea.value.slice(0, pointer - 1) +
      textarea.value.slice(pointer, textarea.value.length);
    textarea.selectionStart = pointer - 1;
    textarea.selectionEnd = pointer - 1;
  } else {
    textarea.value =
      textarea.value.slice(0, textarea.selectionStart) +
      textarea.value.slice(textarea.selectionEnd, textarea.value.length);
    textarea.selectionStart = pointer;
    textarea.selectionEnd = pointer;
  }
});

//Функционал кнопки "Tab"

window.addEventListener("keydown", (e) => {
  textarea.focus();

  if (e.code === "Tab") {
    e.preventDefault();
    tabSpace();
  }
});

const tab = document.querySelector('[keyType="Tab"]');

tab.addEventListener("mousedown", (e) => {
  interactiveClick(tab);
  tabSpace();
});

function tabSpace() {
  let pointer = textarea.selectionStart;

  textarea.value =
    textarea.value.slice(0, pointer) +
    "    " +
    textarea.value.slice(pointer, textarea.value.length);
  textarea.selectionStart = pointer + 4;
  textarea.selectionEnd = pointer + 4;
}

//Функционал кнопки "Enter"

const ENTER = document.querySelector('[keyType="Enter"]');

ENTER.addEventListener("mousedown", (e) => {
  enterClick();
});

function enterClick() {
  let pointer = textarea.selectionStart;

  textarea.value =
    textarea.value.slice(0, pointer) +
    "\n" +
    textarea.value.slice(pointer, textarea.value.length);
  textarea.selectionStart = pointer + 1;
  textarea.selectionEnd = pointer + 1;
}

//Фунционал кнопки "Shift"

const handler = function (e) {
  if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
    e.preventDefault();
    shiftActive = true;
    makeValueKey();

    this.removeEventListener("keydown", handler);
    this.addEventListener("keyup", (e) => {
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        shiftActive = false;
        makeValueKey();
        window.addEventListener("keydown", handler);
      }
    });
  }
};
window.addEventListener("keydown", handler);

const SHIFT_RIGHT = document.querySelector('[ecode="ShiftRight"]');
const SHIFT_LEFT = document.querySelector('[ecode="ShiftLeft"]');

SHIFT_RIGHT.addEventListener("mousedown", (e) => {
  shiftActive = true;
  makeValueKey();
});

SHIFT_LEFT.addEventListener("mousedown", (e) => {
  shiftActive = true;
  makeValueKey();
});

SHIFT_RIGHT.addEventListener("mouseup", (e) => {
  shiftActive = false;
  makeValueKey();
});

SHIFT_LEFT.addEventListener("mouseup", (e) => {
  shiftActive = false;
  makeValueKey();
});

//Фунцционал кнопки "Alt" и "Ctrl" - переключение языков

let altPress = false;
let ctrlPress = false;

const altClick = function (e) {
  if (e.altKey) {
    e.preventDefault();
    if (e.code === "AltLeft") {
      altPress = true;
      if (ctrlPress) {
        if (localStorage.getItem("language") === "en") {
          localStorage.setItem("language", "ru");
        } else {
          localStorage.setItem("language", "en");
        }
        language = localStorage.getItem("language");
        makeValueKey();
      }
      this.removeEventListener("keydown", altClick);
      this.addEventListener("keyup", (e) => {
        if (e.code === "AltLeft") {
          window.addEventListener("keydown", altClick);
        }
      });
    }
  }
};

window.addEventListener("keydown", altClick);

const ctrlClick = function (e) {
  if (e.code === "ControlLeft") {
    ctrlPress = true;
    if (altPress) {
      if (localStorage.getItem("language") === "en") {
        localStorage.setItem("language", "ru");
      } else {
        localStorage.setItem("language", "en");
      }
      language = localStorage.getItem("language");
      makeValueKey();
    }
    this.removeEventListener("keydown", ctrlClick);
    this.addEventListener("keyup", (e) => {
      if (e.code === "ControlLeft") {
        window.addEventListener("keydown", ctrlClick);
      }
    });
  }
};

window.addEventListener("keydown", ctrlClick);

window.addEventListener("keyup", (e) => {
  if (e.code === "AltLeft") {
    altPress = false;
  }
  if (e.code === "ControlLeft") {
    ctrlPress = false;
  }
});

//Фунционал кнопки "CAPSLOCK"

const CAPS_LOCK = document.querySelector('[ecode="CapsLock"]');

CAPS_LOCK.addEventListener("mousedown", (e) => {
  capsLockActive = !capsLockActive;
  CAPS_LOCK.classList.toggle("caps-active");
  makeCapsKey();
});

const capsActivate = function (e) {
  if (e.code === "CapsLock") {
    capsLockActive = !capsLockActive;
    CAPS_LOCK.classList.toggle("caps-active");
    makeCapsKey();
    this.removeEventListener("keydown", capsActivate);
    this.addEventListener("keyup", (e) => {
      if (e.code === "CapsLock") {
        window.addEventListener("keydown", capsActivate);
      }
    });
  }
};
window.addEventListener("keydown", capsActivate);

//Фунционал кнопки "Space"

const SPACE = document.querySelector('[ecode="Space"]');

SPACE.addEventListener("mousedown", (e) => {
  interactiveClick(SPACE);
  Space();
});

function Space() {
  let pointer = textarea.selectionStart;

  textarea.value =
    textarea.value.slice(0, pointer) +
    " " +
    textarea.value.slice(pointer, textarea.value.length);
  textarea.selectionStart = pointer + 1;
  textarea.selectionEnd = pointer + 1;
}

// Функционал кнопки "Delete"

const DELETE = document.querySelector('[ecode="Delete"]');
DELETE.addEventListener("mousedown", () => {
  interactiveClick(DELETE);

  let pointer = textarea.selectionStart;

  if (textarea.selectionStart === textarea.selectionEnd) {
    textarea.value =
      textarea.value.slice(0, pointer) +
      textarea.value.slice(pointer + 1, textarea.value.length);
  }
  textarea.value =
    textarea.value.slice(0, textarea.selectionStart) +
    textarea.value.slice(textarea.selectionEnd, textarea.value.length);
  textarea.selectionStart = pointer;
  textarea.selectionEnd = pointer;
});
