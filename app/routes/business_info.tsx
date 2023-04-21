import { authenticator } from "~/utils/auth.server";
import { getBusinessInfo } from "~/utils/business_utils";

export const loader = async ({request}) => {
  const token = await authenticator.isAuthenticated(request);

  return getBusinessInfo(token);
};