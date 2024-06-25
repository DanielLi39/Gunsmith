'use server';

//import { MongoClient } from "mongodb";
//import { ServerApiVersion } from "mongodb";

import connect from "./connect";

/*
async function connect(data) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    async function run(data) {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            console.log("Client connected!");
            // Send a ping to confirm a successful connection
            const result = await writeData(client, data);
            if (result.acknowledged !== true) {
                return {
                    success: false,
                    error: "Something went wrong..."
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
    const result = await run(data);
    return result;
}
*/
export default async function writeBuild(parameters) {
    const data = {};

    data.name = parameters.name;
    data.author = parameters.author;
    data.gunName = parameters.gunName;
    data.attachments = parameters.attachments.map(attachment => attachment.name);
    data.public = parameters.public;

    const result = await connect(_writeBuild, data, resultHandler, false);

    return result;
}

async function _writeBuild(client, data) {
    console.log(data);
    
    //Check if build already exists
    //console.log(data, {...data, attachments: {$all: data.attachments}});
    const exists = await client.db("mw3_gunbuilds").collection('builds').findOne({...data, attachments: {$all: data.attachments}});
    console.log(exists);
    if (!!exists) {
        return undefined;
    }
    const result = await client.db("mw3_gunbuilds").collection('builds').insertOne(data);
    console.log(result);
    return result;
}

async function resultHandler(result) {
    if (!result) {
        return {
            success: false,
            error: "Build already exists!"
        };
    } else if (result.acknowledged !== true) {
        return {
            success: false,
            error: "Something went wrong..."
        };
    }

    return {
        success: true
    };
}