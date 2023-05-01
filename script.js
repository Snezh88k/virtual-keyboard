import layout from "./layout.json" assert { type: "json" };

const body = document.querySelector("body");
const textarea = document.createElement("textarea");
const keyboard = document.createElement("div");
const title = document.createElement("h1");
keyboard.classList.add("keyboard");
textarea.classList.add("textarea");

title.innerText = "Virtual Keyboard";

body.appendChild(title);
body.appendChild(textarea);
body.appendChild(keyboard);

window.addEventListener("click", (e) => {
  textarea.focus();
});

let language = "en";
let shiftActive = false;

function interactiveClick(elem) {
  elem.classList.add("active");
  setTimeout(() => {
    elem.classList.remove("active");
  }, 400);
}

//Переписывание значения кнопок

const makeValueKey = () => {
  for (let i = 0; i < keys.length; i++) {
    if (language === "ru") {
      if (shiftActive) {
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
      if (shiftActive) {
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
  let pointer = textarea.selectionStart;

  for (let i = 0; i < keys.length; i++) {
    if (
      e.code === keys[i].getAttribute("eCode") &&
      keys[i].getAttribute("keyType") === "standart"
    ) {
      e.preventDefault();
      textarea.value =
        textarea.value.slice(0, pointer) +
        keys[i].getAttribute("value") +
        textarea.value.slice(pointer, textarea.value.length);
    }
  }

  textarea.selectionStart = pointer + 1;
  textarea.selectionEnd = pointer + 1;
});

for (let i = 0; i < standartKeys.length; i++) {
  standartKeys[i].addEventListener("keydown", (e) => {
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

//Функционал кнопки "Backspace"

const backspace = document.querySelector('[keyType="Backspace"]');
backspace.addEventListener("mousedown", () => {
  interactiveClick(backspace);

  let pointer = textarea.selectionStart;
  if (pointer === 0) {
    return;
  }
  textarea.value =
    textarea.value.slice(0, pointer - 1) +
    textarea.value.slice(pointer, textarea.value.length);
  textarea.selectionStart = pointer - 1;
  textarea.selectionEnd = pointer - 1;
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

window.addEventListener("keydown", (e) => {
  if (e.altKey) {
    e.preventDefault();
    if (e.code === "AltLeft") {
      altPress = true;
      if (ctrlPress) {
        language = language === "en" ? "ru" : "en";
        makeValueKey();
      }
    }
  }
});

window.addEventListener("keydown", (e) => {
  if (e.code === "ControlLeft") {
    console.log("тык");
    ctrlPress = true;
    if (altPress) {
      console.log("Переключаем язык");
      language = language === "en" ? "ru" : "en";
      makeValueKey();
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "AltLeft") {
    altPress = false;
  }
  if (e.code === "ControlLeft") {
    ctrlPress = false;
  }
});
