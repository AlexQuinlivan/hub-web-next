import NextAuth, {Account, NextAuthOptions} from 'next-auth';

/** This is the Storypark OIDC provider configuration that will be used by nextauth */
const StoryparkProvider = {
  id: process.env.STORYPARK_OIDC_PROVIDER_ID,
  name: "Storypark",
  type: "oauth",
  clientId: process.env.STORYPARK_OIDC_CLIENT_ID,
  clientSecret: process.env.STORYPARK_OIDC_CLIENT_SECRET,
  wellKnown: `${process.env.STORYPARK_OIDC_ISSUER}/.well-known/openid-configuration`,
  authorization: {
    params: {
      scope: process.env.STORYPARK_OIDC_SCOPES
    }
  },
  idToken: true,
  checks: ["pkce", "state"],
  profile(profile: any) {
    return {
      id: profile.sub,
      name: profile.name,
      email: profile.name,
    }
  }
}
const authOptions: NextAuthOptions = {
  providers: [
    StoryparkProvider as any,
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    // @ts-ignore
    async jwt({token, trigger, account, user}) {
      if (account) {
        console.log("new account/sign in, updating jwt")

        // This is a new "account" most likely triggered by a sign in of some sort
        assertValidAccountCredentials(account)

        // ???(alex): does it matter that we're not validating expiration here? probably not as
        //   if they are expired then the client will request an update first anyway.

        return {
          access_token: account.access_token,
          id_token: account.id_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        }
      } else if (Date.now() < token.expires_at * 1000) {
        // If the access token has not expired yet, return it
        console.log("returning access token as still valid")
        return token
      } else {
        // If the token has expired, try to refresh it
        console.log("token has expired, attempting to refresh")
        try {
          const tokens = await refreshTokens(token.refresh_token)
          assertValidRefreshCredentials(tokens)

          return {
            // keep previous values, but update with token response
            ...token,
            access_token: tokens.access_token,
            id_token: tokens.id_token,
            refresh_token: tokens.refresh_token,
            expires_at: tokens.created_at + tokens.expires_in,
          }

        } catch (e) {
          if (e instanceof Response
            && e.status >= 400
            && e.status <= 499) {
            console.log(`encountered unrecoverable error (status: ${e.status})`)
            throw "RefreshTokenError"
          } else {
            console.log(`encountered recoverable error, try again (err: ${e})`)
          }
        }
      }
    },
    async session({session, token, user}) {
      // Yes, forgive me for the TS disaster that this file is. Trying to get it to be more TS compatible
      // is a thing that auth.js is attempting to solve come v5

      // Send properties to the client, like an access_token and user id from a provider.
      if (token.error) {
        // @ts-ignore
        session.error = token.error
      } else {
        // @ts-ignore
        session.access_token = token.access_token
        // @ts-ignore
        session.id_token = token.id_token
        // @ts-ignore
        session.expires_at = token.expires_at
        // @ts-ignore
        session.error = null
      }
      return session
    }
  }
};

/**
 * With a given user's refresh_token, attempt to fetch a new token tuple
 * @param refresh_token the current refresh_token for the given user
 * @throws {Response} if the response is not ok (does not verify body or status)
 */
const refreshTokens = async (refresh_token: string): Promise<RefreshCredentials> => {
  const response = await fetch(`${process.env.STORYPARK_OIDC_ISSUER}/api/v3/oauth/token`, {
    headers: {
      "Content-Type": "application/json",
      "Accepts": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      client_id: process.env.STORYPARK_OIDC_CLIENT_ID,
      client_secret: process.env.STORYPARK_OIDC_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refresh_token
    })
  })

  const tokens: RefreshCredentials = await response.json()

  if (!response.ok) {
    throw response
  }

  return tokens
}

// Export the handler for the known accepted routes
const handler = NextAuth(authOptions);
// noinspection JSUnusedGlobalSymbols
export {handler as GET, handler as POST};


// - Types

type RefreshCredentials = {
  access_token: string,
  id_token: string,
  refresh_token: string,
  expires_in: number,
  created_at: number
}
declare module "next-auth/jwt" {
  type AuthError = "AuthErrorIncompleteCredentials" | "RefreshTokenError"

  interface JWT {
    access_token: string,
    id_token: string,
    refresh_token: string
    expires_at: number
    error?: AuthError
  }

  interface Session {
    access_token: string,
    id_token: string,
    expires_at: number
    error?: AuthError
  }
}


// - Assertions

const assertValidAccountCredentials = (account: Account) => {
  if (account.expires_at == null
    || account.refresh_token == null
    || account.access_token == null
    || account.id_token == null) {
    throw "AuthErrorIncompleteCredentials"
  }
};

const assertValidRefreshCredentials = (credentials: RefreshCredentials) => {
  if (credentials.expires_in == null
    || credentials.created_at == null
    || credentials.refresh_token == null
    || credentials.access_token == null
    || credentials.id_token == null) {
    throw "AuthErrorIncompleteCredentials"
  }
};
