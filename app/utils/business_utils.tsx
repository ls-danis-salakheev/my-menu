import fetch from "node-fetch";
import { RESTMethods } from "msw";
import { create_token } from "~/utils/create_token";

const main_url: string = `https://main.api.lsk-sbx.app/`;
const main_url_businessInfos = main_url + "/business-info/v1/businesses";

export const getBusinessInfo = async (): Promise<BusinessData> => {
  let payload = await create_token();
  return fetch(main_url_businessInfos, {
    method: RESTMethods.GET,
    headers: {
      "Authorization": "Bearer " + payload.access_token
    }
  }).then(resp => resp.json());
};

interface BusinessData {
  id: number;
  name: string;
  status: string;
  locale: string;
  businessLocations: BusinessLocation[];
}

interface BusinessLocation {
  id: number;
  name: string;
}

