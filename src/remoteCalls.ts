import fetch from "cross-fetch";

function postAndReceive(responseCallback: any, url: string, data: any, callback: any) {
  // Default options are marked with *
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(<any>response);
      }
      return responseCallback(response);
    })
    .then(callback);
}

export function postAndReceiveJSON(url: string, data: any, callback: any) {
  postAndReceive((res: Response) => res.json(), url, data, callback);
}

export function postAndReceivePDF(url: string, data: any, callback: any) {
  postAndReceive((res: Response) => res.arrayBuffer(), url, data, callback);
}

export function getJson(url: string, callback: any) {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(<any>response);
      }
      return response.json();
    })
    .then(callback);
}
