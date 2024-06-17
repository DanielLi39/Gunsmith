import NextAuth from "next-auth";
// import { signInSchema } from "./app/lib/actions/signInSchema";
// import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import queryUser from "./app/lib/actions/queryUser";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    // Credentials({
    //   // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   credentials: {
    //     username: {},
    //     password: {},
    //   },
    //   authorize: async (credentials) => {
    //     try {
    //       let user = null
          
    //       const { username, password } = await signInSchema.parseAsync(credentials)

    //       // logic to salt and hash password
    //       const pwHash = bcrypt.hashSync(password);
  
    //       // logic to verify if user exists
    //       user = await queryUser(username, pwHash);
  
    //       if (!user) {
    //         // No user found, so this is their first attempt to login
    //         // meaning this is also the place you could do registration
    //         throw new CredentialsSignin("Invalid username or password");
    //       }
  
    //       // return user object with the their profile data
    //       return user;
    //     } catch (err) {
    //       if (err instanceof ZodError) {
    //         throw new CredentialsSignin("Invalid username or password");
    //       }
    //     }
    //   },
    // }),
  ],
  pages: {
    signIn: "/signin"
  },
  // callbacks: {
  //   jwt({ token, user }) {
  //     if (user) { // User is available during sign-in
  //       token.id = user.id
  //     }
  //     return token
  //   },
  //   session({ session, token }) {
  //     session.user.id = token.id
  //     return session
  //   },
  // },
})