import layout from "./layout.json" assert { type: "json" };
const body = document.querySelector("body");
const textarea = document.createElement("textarea");
const keyboard = document.createElement("div");
keyboard.classList.add("keyboard");
body.appendChild(textarea);
body.appendChild(keyboard);
textarea.onblur = function () {
  textarea.focus();
};
const makeKey = (value) => {
  const key = document.createElement("div");
  keyboard.appendChild(key);
  key.classList.add("key");
  if (value.size === 1) {
    key.style.width = "50px";
  } else if (value.size === 2) {
    key.style.width = "100px";
  }
  key.innerHTML = value.ru;
  key.setAttribute("keyValueRu", value.ru);
  key.setAttribute("keyValueEn", value.en);
  key.setAttribute("upperCaseName", value.ru.toUpperCase());
  key.setAttribute("keyType", value.type);
  key.setAttribute("keyCode", value.keyCode);
};
for (let i = 0; i < layout.length; i++) {
  makeKey(layout[i]);
}
const keys = document.querySelectorAll(".key");
window.addEventListener("keydown", (e) => {
  console.log(e.key, "e.key");
  console.log(e.shiftKey, "e.shift");
  console.log(e.code, "e.code");
  for (let i = 0; i < keys.length; i++) {
    console.log(keys[i].getAttribute("keyCode"), "keyCode");
    if (
      e.key === keys[i].getAttribute("keyname") ||
      e.key === keys[i].getAttribute("upperCaseName") ||
      e.code === keys[i].getAttribute("keyCode")
    ) {
      keys[i].classList.add("active");
    }
  }
});
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
  standartKeys[i].addEventListener("click", (e) => {
    textarea.value += standartKeys[i].getAttribute("keyValueRu");
    standartKeys[i].classList.add("active");
    setTimeout(() => {
      standartKeys[i].classList.remove("active");
    }, 400);
  });
}
//Функционал кнопки "Backspace"
const backspace = document.querySelector('[keyType="Backspace"]');
backspace.addEventListener("click", (e) => {
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
