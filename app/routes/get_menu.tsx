import { json, LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { completeMenu } from "~/utils/load_menu";

export const loader = async ({ request }: LoaderArgs) => {
  const token = await authenticator.isAuthenticated(request);

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const menuId = searchParams.get("menuId");
  const businessLocationId = searchParams.get("businessLocationId");
  const businessId = searchParams.get("businessId");
  
  if (menuId == null || businessLocationId == null || businessId == null) {
    throw new Error("Cannot find parameters");
  }
  return completeMenu(menuId, businessLocationId, businessId, token).then(resp => json(resp));
};