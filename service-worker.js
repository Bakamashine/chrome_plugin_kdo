console.log("service is worked!");
const LOCAL_URL = "http://localhost:5018/prompt";
let prompt = "";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Message received!");
  if (message.data) {
    prompt = message.data;
  }
  if (prompt) {
    (async () => {
      try {
        const formData = new FormData();
        formData.append("text", prompt);
        let response = await fetch(LOCAL_URL, {
          method: "POST",
          // headers: {
          //   "Content-Type": "multipart/form-data"
          // },
          body: formData
        });
        let answer = await response.text();
        console.log("answer Gigachat: ", answer);
        if (answer) {
          sendResponse({ answer });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        sendResponse({ error: error.message });
      }
    })();
  }
  return true;
});
