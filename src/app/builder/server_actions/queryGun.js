'use server';

import { MongoClient } from "mongodb";
import { ServerApiVersion } from "mongodb";

async function readData(client, gunName) {
    const result = await client.db("mw3_gunbuilds").collection("guns").findOne( {name: gunName}, { projection: {_id: 0}});

    console.log(result);
    return result;
}

async function connect(query) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    async function run(query) {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            console.log("Client connected!");
            // Send a ping to confirm a successful connection
            const result = await readData(client, query);
            if (result === null) {
                return {
                    success: false,
                    error: "No such gun found."
                };
            }
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return {
                success: true,
                data: result
            };
        } catch (error) {
            console.log(error);
            return {
                success: false,
                error: error.toString()
            };
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
    const result = await run(query);
    return result;
}

export async function queryGun(gunName) {
    const result = await connect(gunName); 
    return result;
}