import { json, LoaderArgs } from "@remix-run/node";
import { completeMenu, fetchAllMenu } from "~/utils/load_menu";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  console.log("dsfds");
  const searchParams = new URLSearchParams(url.search);
  const businessLocationId = searchParams.get("businessLocationId");
  if (businessLocationId == null) {
    throw new Error("Cannot find parameters");
  }
  return fetchAllMenu(businessLocationId).then(resp => json(resp));
};