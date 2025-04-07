import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [], // ❌ ไม่มี Provider เช่น Google แล้ว

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user.user_id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});

export const GET = handler;
export const POST = handler;
