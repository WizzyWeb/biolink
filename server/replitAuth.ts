import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

/**
 * Creates Express session middleware backed by a PostgreSQL store with a one-week session TTL.
 *
 * Uses DATABASE_URL for the PostgreSQL connection and SESSION_SECRET to sign session cookies. The middleware is configured with httpOnly and secure cookies, a maxAge of one week, and resave/saveUninitialized disabled.
 *
 * @returns An Express-compatible session middleware configured with a PostgreSQL-backed store and cookies set to httpOnly, secure, and a one-week maxAge.
 */
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

/**
 * Populates a session user object with identity claims and token credentials.
 *
 * @param user - Session user object to update; will be mutated with `claims`, `access_token`, `refresh_token`, and `expires_at`.
 * @param tokens - Token response providing `claims()`, `access_token`, and `refresh_token`.
 */
function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

/**
 * Creates or updates a user record from OpenID Connect claims and ensures the user has a profile.
 *
 * If no profile exists for the upserted user, a profile is created with a username derived from the email
 * (or a fallback based on the subject), a display name from the first name or email, a default bio, and the
 * provided profile image URL.
 *
 * @param claims - OIDC token claims; expected keys include `sub` (user id), `email`, `first_name`, `last_name`, and `profile_image_url`.
 */
async function upsertUser(
  claims: any,
) {
  const user = await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
  
  // Auto-create profile if it doesn't exist
  const existingProfile = await storage.getProfileByUserId(user.id);
  if (!existingProfile) {
    const username = claims["email"]?.split("@")[0] || `user${claims["sub"]}`;
    await storage.createProfile({
      userId: user.id,
      username,
      displayName: claims["first_name"] || claims["email"] || "User",
      bio: "Welcome to my LinkHub profile!",
      profileImageUrl: claims["profile_image_url"],
    });
  }
}

/**
 * Configures an Express application with Replit OpenID Connect authentication.
 *
 * Installs session and Passport middleware, discovers OIDC configuration, registers a named Passport strategy for each domain in `REPLIT_DOMAINS`, and mounts authentication routes:
 * - GET /api/login — starts domain-specific OIDC login
 * - GET /api/callback — handles the OIDC callback and redirects on success or failure
 * - GET /api/logout — logs out and redirects to the provider's end-session URL
 *
 * The strategy verification stores token claims and tokens on the session and upserts the user record (using `upsertUser` and `updateUserSession`). Uses `REPLIT_DOMAINS` and `REPL_ID` environment variables to build strategy names, callback URLs, and end-session redirects.
 *
 * @param app - The Express application to configure for authentication
 */
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};