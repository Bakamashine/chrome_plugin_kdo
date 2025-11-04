const URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const URL_GET_MODEL = "https://gigachat.devices.sberbank.ru/api/v1/models";
const URL_PROMPT =
  "https://gigachat.devices.sberbank.ru/api/v1/chat/completions";

const CLIENT_ID = "8a38278f-807c-4a8f-9285-b25860e0e247";
const AUTH_KEY =
  "OGEzODI3OGYtODA3Yy00YThmLTkyODUtYjI1ODYwZTBlMjQ3OjIxZmQyODdlLTVlNTAtNGEyZi1hZWQ5LTkyYzYyZDI5MzI4Yg==";
const SCOPE = "GIGACHAT_API_PERS";

let CLIENT_KEY;

async function AuthorizateFetch(url, method) {
  return await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      RqUID: CLIENT_ID,
      Authorization: `Basic ${AUTH_KEY}`,
    },
  });
}

/**
 * Fetch для авторизированных действий
 * @param {*} url
 * @param {*} method
 * @param {object} data
 * @returns
 */
async function ApiFetch(url, method, data) {
  return await fetch(url, {
    method,
    data,
    // data: Object.assign(data, {
    // 	agent: new https.Agent
    // }),
	mode: "cors",
    headers: {
      Authorization: `Bearer ${CLIENT_KEY}`,
      Accept: "application/json",
      "Content-Type": "applicaiton/json",
    },
  });
}

/**
 * Получение токена авторизации
 */
async function GetToken() {
  console.log("Получение токена Gigachat...");
  const payload = {
    scope: SCOPE,
  };
  try {
    const response = await AuthorizateFetch(URL, "POST", payload);
    console.log("response: ", response);
    console.log("response body: ", response.body);
    CLIENT_KEY = response.body;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Читает ответ нейронки
 * @param {*} response
 * @returns
 */
function ReadAnswer(response) {
  return {
    message: response["choices"][0].message.content,
    role: response["choices"][0].message.role,
  };
}

/**
 * Отправляет промпт в Gigachat
 * @param {string} text Текст промпта
 * @returns
 */
async function sendPrompt(text) {
  console.log("Отправка запроса в Gigachat...");
  const data = {
    model: "Gigachat-2-Max",
    messages: [
      {
        role: "system",
        content: "Пиши только код. Объяснения и приветствия не нужны",
      },
      { role: "user", content: text },
    ],
    stream: false,
    update_interfal: 0,
  };

  try {
    const response = await ApiFetch(URL_PROMPT, "POST", data);
    console.log("SendPrompt Response: ", response.data);
    console.log("Response Gigachat: ", response.data["choices"][0].message);
    // return response.data;
    return ReadAnswer(response.data);
  } catch (error) {
    console.error(error);
  }
}

const pageInfo = {
  url: window.location.href,
  title: document.title,
  images: Array.from(document.images).map((img) => img.src),
};
console.log("Page info: ", pageInfo);

const qtext = document.querySelector(".qtext");
const clearfix = qtext.children[0];

if (!qtext || !clearfix) {
  throw new Error(
    "Not found tag <div class='clearfix' /> or <div class='qtext' />"
  );
}

console.log("qtext: ", qtext);
console.log("clearfix: ", clearfix);

let prompt = "";
if (clearfix || qtext) {
  for (let item of clearfix.children) {
    if (
      item ||
      item.textContent ||
      item.value ||
      item.children[0].textContent
    ) {
      for (let item_child of item.children) {
        let text = item_child.textContent;
        prompt += text;
      }
    }
  }

  console.log("Итоговый промпт: ", prompt);

  (async () => {
    await GetToken();
    if (CLIENT_KEY) {
      await sendPrompt(prompt);
    }
  })();
}

chrome.runtime.sendMessage({ action: "pageInfo", data: pageInfo });
