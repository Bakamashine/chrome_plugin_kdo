// const pageInfo = {
//   url: window.location.href,
//   title: document.title,
//   images: Array.from(document.images).map((img) => img.src),
// };
// console.log("Page info: ", pageInfo);

const qtext = document.querySelector(".qtext");
const clearfix = qtext ? qtext.querySelector(".clearfix") : null;

/** @type {HTMLInputElement} */
const textarea = document.querySelector("textarea");

/** @type {HTMLParagraphElement} */
const state = document.querySelector(".state");

/** @type {HTMLInputElement[]} */
// const buttons = document.querySelectorAll(".btn");

/** @type {HTMLInputElement} */
// let check_button;
// buttons.forEach((elem) => {
//   if (elem.textContent == "Проверить") {
//     check_button = elem;
//   }
// });
// console.log("check_button: ", check_button);

/** @type {HTMLFormElement} */
let form = document.querySelector("form");

if (!qtext || !clearfix) {
  throw new Error(
    "Not found tag <div class='clearfix' /> or <div class='qtext' />"
  );
}

console.log("qtext: ", qtext);
console.log("clearfix: ", clearfix);

let prompt = "";
if (clearfix || qtext) {
  Array.from(clearfix.children).forEach((child) => {
    if (child.textContent.trim()) {
      prompt += child.textContent.trim() + "\n";
    }
  });
}
console.log("Итоговый промпт: ", prompt);

if (state.textContent != "Верно") {
  chrome.runtime.sendMessage(
    {
      action: "successPrompt",
      data: prompt,
    },
    (response) => {
      console.log("Gigachat answer: ", response.answer);
      textarea.textContent = response.answer;
      // form.submit();
      return true;
    }
  );
}
