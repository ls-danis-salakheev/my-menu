import { json, LoaderArgs } from "@remix-run/node";
import { completeMenu } from "~/utils/load_menu";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const menuId = searchParams.get("menuId");
  const businessLocationId = searchParams.get("businessLocationId");
  const businessId = searchParams.get("businessId");
  if (menuId == null || businessLocationId == null || businessId == null) {
    throw new Error("Cannot find parameters");
  }
  return completeMenu(menuId, businessLocationId, businessId).then(resp => json(resp));
};