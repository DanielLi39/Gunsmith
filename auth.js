import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from 'next-auth/providers/credentials';
import { MongoClient } from "mongodb";
import { ServerApiVersion } from "mongodb";
import bcrypt from 'bcrypt';

async function getUser(username) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const user = await client.db("mw3_gunbuilds").collection("users").findOne( {username: username} );
        return user;
    } catch (error) {
        console.log("Failed to fetch user:", error);
        throw new Error('Failed to fetch user.');
    }
}


//No idea what this is doing
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const { username, password } = credentials;
                const user = await getUser(username);
                if (!user) return null;
                
                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch) return user;
                return null;
            }
        })
    ]
});