const URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
const URL_GET_MODEL = "https://gigachat.devices.sberbank.ru/api/v1/models";
const URL_PROMPT =
  "https://gigachat.devices.sberbank.ru/api/v1/chat/completions";

const CLIENT_ID = "8a38278f-807c-4a8f-9285-b25860e0e247";
const AUTH_KEY =
  "OGEzODI3OGYtODA3Yy00YThmLTkyODUtYjI1ODYwZTBlMjQ3OjIxZmQyODdlLTVlNTAtNGEyZi1hZWQ5LTkyYzYyZDI5MzI4Yg==";
const SCOPE = "GIGACHAT_API_PERS";

let CLIENT_KEY;

/**
 * Настройка fetch для авторизации
 * @param {string} url
 * @param {string} method
 * @returns
 */
async function AuthorizateFetch(url, method, payload) {
  return fetch(url, {
    method,
    // mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      RqUID: CLIENT_ID,
      Authorization: `Basic ${AUTH_KEY}`,
    },
    credentials: "include",
    // body
    body: new URLSearchParams(payload).toString(), // Формируем параметры запроса
  })
    .then((res) => {
      console.log("res.status: ", res.status);
    })
    .then((res) => {
      console.log(res.body);
    })
    .then((res) => res.json())
    .then((data) => console.log("+", data))
    .catch((e) => {
      console.log("Error: ", e.message);
      console.log(e.response);
    });
  // try {
  //   let result = await fetch(url, {
  //     method,
  //     mode: "cors",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       Accept: "application/json",
  //       RqUID: CLIENT_ID,
  //       Authorization: `Basic ${AUTH_KEY}`,
  //     },
  //     credentials: "include",
  //     // body
  //     body: new URLSearchParams(payload).toString(), // Формируем параметры запроса

  //   });
  //   return result;
  // } catch (e) {
  //   console.error(e);
  // }
}

/**
 * Fetch для авторизированных действий
 * @param {string} url
 * @param {string} method
 * @param {object} data
 * @returns
 */
async function ApiFetch(url, method, data) {
  let result = await fetch(url, {
    method,
    data,
    mode: "cors",
    headers: {
      Authorization: `Bearer ${CLIENT_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  console.log("status: ", result.status);
  console.log("body: ", result.body);
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
    model: "Gigachat",
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

console.log("service is worked!");
let prompt = "";
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Message received!");
  // console.log(message.data)
  if (message.data) prompt = message.data;
  // console.log("prompt: ", prompt);
  if (prompt) {
    (async () => {
      await GetToken();
      if (CLIENT_KEY) {
        await sendPrompt(prompt);
      }
    })();
  }
});