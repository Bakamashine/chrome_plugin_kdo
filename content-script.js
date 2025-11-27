const qtext = document.querySelector(".qtext");
const clearfix = qtext ? qtext.querySelector(".clearfix") : null;
const answer = document.querySelector(".answer");

/** @type {HTMLInputElement} */
const textarea = document.querySelector("textarea");

/** @type {HTMLParagraphElement} */
const state = document.querySelector(".state");

/** @type {HTMLFormElement} */
let form = document.querySelector("form");

if (!qtext || !clearfix) {
  throw new Error(
    "Not found tag <div class='clearfix' /> or <div class='qtext' />"
  );
}

console.log("qtext: ", qtext);
console.log("clearfix: ", clearfix);
console.log("answer: ", answer);
console.log("textarea: ", textarea);
console.log("state: ", state);
console.log("form: ", form);

let prompt = "";
let variant_prompt = "";
if (clearfix || qtext) {
  Array.from(clearfix.children).forEach((child) => {
    if (child.textContent.trim()) {
      prompt += child.textContent.trim() + "\n";
    }
  });
}

// При варианте выбора
if (answer) {
  variant_prompt += "Варианты ответов: ";
  [...answer.children].forEach((elem) => {
    let input = elem.querySelectorAll("input");
    let span = elem.querySelector("span");
    if (input.length != 0) {
      if (input.length == 1) {
        input = elem.querySelector("input");
        variant_prompt += input.value + "." + span.textContent + "\n";
      } else {
        let id = input[0].name.slice(-1);
        variant_prompt += id + "." + span.textContent + "\n";
      }
    }
  });
}

if (variant_prompt && variant_prompt != "Варианты ответов: ") {
  prompt += variant_prompt;
} else {
  prompt += "Без вариантов ответа"
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

      if (response.answer) {
        if (textarea) textarea.textContent = response.answer;
        if (answer) {
          let splitResponse = response.answer.split(".");
          [...answer.children].forEach((elem) => {
            let input = elem.querySelectorAll("input");
            if (input.length == 1) {
              input = elem.querySelector("input");
              if (input.value == splitResponse[0]) {
                input.click();
                return;
              }
            } else if (input.length > 1) {
              if (input[0].name.slice(-1) == splitResponse[0]) {
                input[1].click();
              }
            }
          });
        }
      }
      return true;
    }
  );
}
