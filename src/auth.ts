import { env } from "$env/dynamic/private";

import { SvelteKitAuth, type DefaultSession } from "@auth/sveltekit";
import { SurrealDBAdapter } from "@auth/surrealdb-adapter";
import { clientPromise } from "$lib/surrealdb";

import Google from "@auth/sveltekit/providers/google";
import Facebook from "@auth/sveltekit/providers/facebook";

declare module "@auth/sveltekit" {
  interface Session {
    user: {
      userId: string,
      image: string,
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
}
 
export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  pages: {
    newUser: "/setup",
    signIn: "/login",
  },
  adapter: SurrealDBAdapter(clientPromise),
  secret: env.AUTH_SECRET,
  //debug: true
})