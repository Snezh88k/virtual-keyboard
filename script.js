import layout from "./layout.json" assert { type: "json" };

const body = document.querySelector("body");
const textarea = document.createElement("textarea");
const keyboard = document.createElement("div");
const title = document.createElement("h1");
keyboard.classList.add("keyboard");
textarea.classList.add("textarea");
textarea.setAttribute("rows", "10");
textarea.setAttribute("cols", "50");
title.innerText = "Virtual Keyboard";

body.appendChild(title);
body.appendChild(textarea);
body.appendChild(keyboard);

textarea.focus();
window.addEventListener("click", (e) => {
  textarea.focus();
});

let language = "en";

function interactiveClick(elem) {
  elem.classList.add("active");
  setTimeout(() => {
    elem.classList.remove("active");
  }, 400);
}

let shiftActive = false;

// Создание кнопки

const makeValueKey = () => {
  for (let i = 0; i < keys.length; i++) {
    if (language === "ru") {
      if (shiftActive) {
        layout[i].ru_shift
          ? (keys[i].innerHTML = layout[i].ru_shift)
          : (keys[i].innerHTML = layout[i].ru);
      } else {
        keys[i].innerHTML = layout[i].ru;
      }
    } else {
      if (shiftActive) {
        layout[i].en_shift
          ? (keys[i].innerHTML = layout[i].en_shift)
          : (keys[i].innerHTML = layout[i].ru);
      } else {
        keys[i].innerHTML = layout[i].en;
      }
    }
  }
};

const makeKey = (value) => {
  const { ru, en, ru_shift, en_shift, type, keyCode, size, eCode } = value;

  const key = document.createElement("div");
  keyboard.appendChild(key);
  key.classList.add("key");
  if (size === 1) {
    key.style.width = "50px";
  } else if (size === 2) {
    key.style.width = "100px";
  } else if (size === 1.5) {
    key.style.width = "75px";
  }

  key.setAttribute("keyValueRu", ru);
  key.setAttribute("keyValueEn", en);
  key.setAttribute("keyType", type);
  key.setAttribute("keyCode", keyCode);
  key.setAttribute("eCode", eCode);

  if (language === "ru") {
    if (shiftActive) {
      ru_shift ? (key.innerText = ru_shift) : (key.innerText = ru);
    } else {
      key.innerText = ru;
    }
  } else {
    if (shiftActive) {
      en_shift ? (key.innerText = en_shift) : (key.innerText = ru);
    } else {
      key.innerText = en;
    }
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

  if (e.code === "Tab") {
    e.preventDefault();
    tabSpace();
  }

  console.log(e.code, "e.code");
  console.log(e.shiftKey);

  for (let i = 0; i < keys.length; i++) {
    if (e.code === keys[i].getAttribute("ecode")) {
      keys[i].classList.add("active");
    }
  }
});

//Удаление стилей на кнопки

window.addEventListener("keyup", (e) => {
  for (let i = 0; i < keys.length; i++) {
    if (
      e.code === keys[i].getAttribute("keyCode") ||
      e.code === keys[i].getAttribute("eCode")
    ) {
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
      standartKeys[i].getAttribute("keyValueRu") +
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

const SHIFT = document.querySelector('[keyType="ShiftRight"]');
console.log(SHIFT);
SHIFT.addEventListener("keydown", (e) => {
  console.log(e);
});

//Фунцционал кнопки "Shift"

var handler = function (e) {
  if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
    console.log("aaa", e);
    shiftActive = true;
    makeValueKey();

    this.removeEventListener("keydown", handler);
    this.addEventListener("keyup", (e) => {
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        console.log("dasdsa");
        shiftActive = false;
        makeValueKey();
        window.addEventListener("keydown", handler);
      }
    });
  }
};
window.addEventListener("keydown", handler);

//Фунцционал кнопки "Alt" и "Ctrl"
