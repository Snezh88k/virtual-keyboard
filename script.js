import layout from "./layout.json" assert { type: "json" };

const body = document.querySelector("body");
const textarea = document.createElement("textarea");
const keyboard = document.createElement("div");
keyboard.classList.add("keyboard");
textarea.classList.add("textarea");
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

// Создание кнопки

const makeKey = (value) => {
  const { ru, en, type, keyCode, size } = value;
  // console.log(ru, en, type, keyCode);
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

  if (language === "en") {
    key.setAttribute("upperCaseName", en.toUpperCase());
    key.innerHTML = en;
  } else {
    key.setAttribute("upperCaseName", ru.toUpperCase());
    key.innerHTML = ru;
  }
};
for (let i = 0; i < layout.length; i++) {
  makeKey(layout[i]);
}

//Добавление стилей на кнопки при нажатии

const keys = document.querySelectorAll(".key");
window.addEventListener("keydown", (e) => {
  textarea.focus();
  if (e.code === "Tab") {
    e.preventDefault();
    tabSpace();
  }
  // console.log(e.key, "e.key");
  // console.log(e.shiftKey, "e.shift");
  // console.log(e.code, "e.code");
  for (let i = 0; i < keys.length; i++) {
    // console.log(keys[i].getAttribute("keyCode"), "keyCode");
    if (
      e.key === keys[i].getAttribute("keyname") ||
      e.key === keys[i].getAttribute("upperCaseName") ||
      e.code === keys[i].getAttribute("keyCode")
    ) {
      keys[i].classList.add("active");
    }
  }
});

//Удаление стилей на кнопки

window.addEventListener("keyup", (e) => {
  for (let i = 0; i < keys.length; i++) {
    if (
      e.key === keys[i].getAttribute("keyname") ||
      e.key === keys[i].getAttribute("upperCaseName") ||
      e.code === keys[i].getAttribute("keyCode")
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
    textarea.value += standartKeys[i].getAttribute("keyValueRu");

    interactiveClick(standartKeys[i]);
  });
}

//Функционал кнопки "Backspace"

const backspace = document.querySelector('[keyType="Backspace"]');
backspace.addEventListener("mousedown", (e) => {
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
