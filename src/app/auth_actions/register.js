'use server';

import { MongoClient } from 'mongodb';
import { ServerApiVersion } from 'mongodb';
import bcrypt from 'bcrypt';

async function registerUser(client, username, password) {
    const hashed = await bcrypt.hash(password, 10);
    const exists = await client.db("mw3_gunbuilds").collection("users").findOne( {username: username });
    if (exists) return null;

    const result = await client.db("mw3_gunbuilds").collection("users").insertOne( {username: username, password: hashed} );
    return result;
}

async function connect(username, password) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    async function run(username, password) {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            console.log("Client connected!");
            // Send a ping to confirm a successful connection
            const result = await registerUser(client, username, password);
            //Fix later
            if (!result) {
                return {
                    success: false,
                    error: "Some error occurred while registering."
                };
            }
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return {
                success: true
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
    const result = await run(username, password);
    return result;
}

export async function register(formData) {
    const result = await connect(formData.get('username'), formData.get('password'));
    return result;
}