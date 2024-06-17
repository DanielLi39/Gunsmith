'use server';

import { MongoClient, ServerApiVersion } from "mongodb";

export default async function queryUser(email) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const result = await client.db("mw3_gunbuilds").collection("users").findOne({email: email}, {projection: {_id: 0}});
        
        console.log(result);
        if (!result) {
            return result;
        }
        return result.username;
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}