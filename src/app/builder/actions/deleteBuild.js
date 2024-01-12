'use server';

import { MongoClient, ObjectId } from "mongodb";
import { ServerApiVersion } from "mongodb";

async function deleteId(client, id) {
    const objId = new ObjectId(id);
    const result = await client.db("mw3_gunbuilds").collection("builds").deleteOne( {_id: objId} );
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
            const result = await deleteId(client, query);
            //Fix later
            if (!result.acknowledged) {
                return {
                    success: false,
                    error: "No such gun found."
                };
            }
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return {
                success: true,
                data: result.deletedCount
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

export default async function deleteBuild(id) {
    const result = await connect(id);
    return result;
}