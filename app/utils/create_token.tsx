import fetch from "node-fetch";
import { RESTMethods } from "msw";

const baseUrl = "https://main.api.lsk-sbx.app/";

export const create_token = async (): Promise<Payload> => {

  return fetch(baseUrl + "oauth/token?grant_type=client_credentials", {
    method: RESTMethods.POST, headers: {
      "Authorization": "Basic cG9zLWFkbWluLWNsaWVudC1pZDpwb3MtYWRtaW4tY2xpZW50LXNlY3JldC1mODc3Y2ExOS1mZDlkLTRjNjItODEzNi1kM2I5NWZhODJjYTQ="
    }
  }).then(res => res.json());
};

interface Payload {
  "access_token": string,
  "token_type": string,
  "expires_in": number,
}