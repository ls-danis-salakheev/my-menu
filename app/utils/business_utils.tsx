import fetch from "node-fetch";
import { RESTMethods } from "msw";

const main_url: string = `https://main.api.lsk-sbx.app/`;
const main_url_businessInfos = main_url + "/business-info/v1/businesses";

export const getBusinessInfo = async (token: unknown): Promise<BusinessData> => {
  return fetch(main_url_businessInfos, {
    method: RESTMethods.GET,
    headers: {
      "Authorization": "Bearer " + token
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

