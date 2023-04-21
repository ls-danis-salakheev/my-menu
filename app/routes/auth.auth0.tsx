import type { ActionArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";

export let loader = ({ request }: ActionArgs) => {
  return authenticator.authenticate("keycloak", request);
};