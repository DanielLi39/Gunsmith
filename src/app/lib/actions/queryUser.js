'use server';

import { MongoClient } from "mongodb";

export default async function queryUser(username, password) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        if (debug) console.log("Client connected!");
        const result = await client.db("mw3_gunbuilds").collection("users").findOne({username: username, password: password}, {projection: {_id: 0}});
        if (debug) console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return result;
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}