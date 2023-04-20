import { getBusinessInfo } from "~/utils/business_utils";

export const loader = async () => {
  return getBusinessInfo();
};