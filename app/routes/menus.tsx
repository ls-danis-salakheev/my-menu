import { json, LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { completeMenu, fetchAllMenu } from "~/utils/load_menu";

export const loader = async ({ request }: LoaderArgs) => {
  const token = await authenticator.isAuthenticated(request);

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const businessLocationId = searchParams.get("businessLocationId");
  if (businessLocationId == null) {
    throw new Error("Cannot find parameters");
  }
  return fetchAllMenu(businessLocationId, token).then(resp => json(resp));
};