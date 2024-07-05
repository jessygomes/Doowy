import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./lib/actions/user.actions";
import { Role } from "@prisma/client";

// Pour éviter les erreurs de type (erreur de type pour session.user.role : il ne reconnait pas "role")
type ExtentedUser = DefaultSession["user"] & {
  role: Role;
  // ou bien : role : "user" | "admin" | "organizer";
};

declare module "next-auth" {
  interface Session {
    user: ExtentedUser;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/connexion",
    error: "/auth/error", // Redirige vers NOTRE page d'erreur si il y a une erreur
  },
  events: {
    // Quand on se connecte avec Google, l'email est déjà vérifié donc on le met à jour directement dans la base de données
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // On autorise la connexion sans email Vérification pour Google
      if (account?.provider !== "credentials") return true;

      // Ici, si le user n'est pas vérifié, il ne peut pas se connecter
      const existingUser = user.id ? await getUserById(user.id) : null;
      if (!existingUser || !existingUser?.emailVerified) return false;

      return true;
    },

    async session({ token, session }) {
      // Ici, le but est de rajouter l'ID du User dans la session (car il n'y ai pas de base) :
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as ExtentedUser["role"];
      }

      return session;
    },
    async jwt({ token }) {
      // console.log("JWT CALLBACK", token); : Quand on affiche le token, on voit que le "sub" correspond à l'id du user
      // Pour ajouter le rôle du user à la session, on passe par le token car c'est grâce à celui ci que le middleware va autoriser ou non l'accès à certaines routes
      // Le rôle va être ajouté au dessus dans la session
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  // On passe la DB à PrismaAdapter
  adapter: PrismaAdapter(db),
  // On change la stratégie de session : avec prisma, on doit utiliser "jwt"
  session: { strategy: "jwt" },
  // On passe la config d'auth.config
  ...authConfig,
});
