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
      name: string,
      image: string,
      email: string,
      emailVerified: Date | null
    } & DefaultSession["user"],
  }
}
 
export const { handle, signIn, signOut } = SvelteKitAuth({
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.userId = user.id;
        session.user.name = user.name || "";
        session.user.image = user.image || "";
        session.user.email = user.email || "";
        session.user.emailVerified = user.emailVerified || null;
      }
      return session;
    }
  },
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
  trustHost: true, // Remove this in production
  //debug: true
})