import fetch from "node-fetch";
import { RESTMethods } from "msw";

const baseUrl = "https://main.api.lsk-sbx.app/";
const value = (process.env.VAL as string)

export const create_token = async (): Promise<Payload> => {

  return fetch(baseUrl + "oauth/token?grant_type=client_credentials", {
    method: RESTMethods.POST, headers: {
      "Authorization": value
    }
  }).then(res => res.json());
};

interface Payload {
  "access_token": string,
  "token_type": string,
  "expires_in": number,
}