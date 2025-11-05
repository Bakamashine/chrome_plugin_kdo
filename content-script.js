const pageInfo = {
  url: window.location.href,
  title: document.title,
  images: Array.from(document.images).map((img) => img.src),
};
console.log("Page info: ", pageInfo);

const qtext = document.querySelector(".qtext");
const clearfix = qtext ? qtext.querySelector(".clearfix") : null;

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
// if (clearfix || qtext) {
//   for (let item of clearfix.children) {
//     if (
//       item ||
//       item.textContent ||
//       item.value ||
//       item.children[0].textContent
//     ) {
//       for (let item_child of item.children) {
//         let text = item_child.textContent;
//         prompt += text;
//       }
//     }
//   }

console.log("Итоговый промпт: ", prompt);

// (async () => {
//   await GetToken();
//   if (CLIENT_KEY) {
//     await sendPrompt(prompt);
//   }
// })();

// navigator.serviceWorker.controller.postMessage(prompt);
// navigator.serviceWorker.ready
//   .then((register) => {
//     register.active.postMessage(prompt);
//   })
//   .catch((e) => console.error("Error send serviceWorker message: ", e.message));

chrome.runtime.sendMessage({
  action: "successPrompt",
  data: prompt,
});
