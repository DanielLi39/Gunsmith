import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

//This should be where NextAuth is initialized
export default NextAuth(authConfig).auth;

//For now, only want to protect builder
export const config = {
    matcher: ['/builder/']
}