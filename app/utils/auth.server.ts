// app/utils/auth.server.ts
import { createCookieSessionStorage } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { KeycloakStrategy } from "remix-auth-keycloak";

export const sessionStorage = createCookieSessionStorage({  });

export const authenticator = new Authenticator(sessionStorage);

let keycloakStrategy = new KeycloakStrategy(
  {
    useSSL: true,
    domain: "auth0-mock.sbx.lsk.lightspeed.app/auth",
    realm: "k-series-realm",
    clientID: "pos-admin-client-id",
    clientSecret: (process.env.pass_val as string),
    callbackURL: "/auth/auth0/callback",
  },
  async ({ accessToken }) => {
    return accessToken;
  }
);

authenticator.use(keycloakStrategy);