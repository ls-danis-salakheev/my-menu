import fetch from "node-fetch";
import { RESTMethods } from "msw";
import { create_token } from "~/utils/create_token";

const load_menu = `https://main.api.lsk-sbx.app/o/op/1/menu/load/`;
const get_images = `https://main.api.lsk-sbx.app/i/richItem/`;

export const completeMenu = async (menuId: string, businessLocationId: string, businessId: string): Promise<MyMenu> => {
  let payloadPromise = await create_token();
  return loadMenu(menuId, businessLocationId).then(async res => {
    const menuEntryGroups = res.menuEntryGroups;
    menuEntryGroups.flatMap(r => r.menuEntry).map(me => me.sku);
    const menuItems = new Set(menuEntryGroups
      .flatMap(group => group.menuEntry));

    const imagesAndDescription = await getImagesAndDescription(businessId, payloadPromise.access_token)
      .then(res => res._embedded.richItemDtoList);
    const richItemMap = new Map<string, RichItem>();
    imagesAndDescription.forEach(item => richItemMap.set(item.sku, item));

    menuItems.forEach(menu => {
      const data = richItemMap.get(menu.sku);
      if (data != null) {
        menu.description = data.descriptions[0]?.description;
        menu.pictureUrl = data.pictureUrl;
      }
    });
    return res;
  });
};

const loadMenu = async (menuId: string, businessLocationId: string): Promise<MyMenu> => {
  const payload = await create_token();
  return fetch(load_menu + menuId + "?businessLocationId=" + businessLocationId, {
    method: RESTMethods.GET,
    headers: {
      "Authorization": "Bearer " + payload.access_token
    }
  }).then(resp => resp.json());
};

export const getImagesAndDescription = (businessId: string, token: string): Promise<RichItemResponse> => {
  return fetch(get_images + businessId, {
    headers: {
      "Authorization": "Bearer " + token
    }
  }).then(resp => {
    if (!resp.ok) {
      return null;
    } else {
      return resp.json();
    }
  });
};

interface Description {
  description: string;
  displayName: string;
  localeCode: string;
}

interface Links {
  self: {
    href: string;
  };
  items: {
    href: string;
  };
}

interface RichItem {
  allergenCodes: string[];
  businessId: number;
  descriptions: Description[];
  sku: string;
  creationDate: string;
  lastUpdateDate: string;
  pictureUrl: string;
  rawPictureUrl: string;
  _links: Links;
}

interface MenuItem {
  "@type": string;
  productName: string;
  productPrice: string;
  color: string;
  sku: string;
  customItemNameEnabled: boolean;
  pricingStrategy: string;
  defaultTaxAmount: string;
  defaultTaxPercentage: string;
  asSubItem: boolean;
  type: string;
  taxIncludedInPrice: boolean;
  pictureUrl: string;
  description: string | undefined;
}

interface Group {
  "@type": string;
  id: string;
  name: string;
  color: string;
  menuEntry: MenuItem[];
  type: string;
}

interface MyMenu {
  menuName: string;
  menuEntryGroups: Group[];
  ikentooMenuId: number;
}


interface Link {
  href: string;
}

interface RichItemDto {
  businessId: number;
  sku: string;
  pictureUrl: string;
  rawPictureUrl: string;
  fileType: string | null;
  rawPicture: any;
  picture: any;
  creationDate: string;
  lastUpdateDate: string;
  descriptions: any[];
  allergenCodes: any[];
  _links: {
    self: Link;
    items: Link;
  };
}

interface Embedded {
  richItemDtoList: RichItemDto[];
}

interface RichItemResponse {
  _embedded: Embedded;
  _links: {
    self: Link;
  };
}

