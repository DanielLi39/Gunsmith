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
export default async function writeBuild( formData ) {
    const data = [];
    var first = true;
    for (const pair of formData.entries()) {
        if (!first) {
            if (pair[0] === 'attachments') {
                if (pair[1] === '') {
                    data.push([pair[0], []]);
                } else {
                    data.push([pair[0], pair[1].split(',')]);
                }
            } else if (pair[0] === 'public') {
                data.push([pair[0], (pair[1] === 'on' ? true : false)])
            } else {
                data.push([pair[0], pair[1]]);
            }
        } else {
            first = false;
        }
    }
    const result = await connect(_writeBuild, Object.fromEntries(data), resultHandler, false);

    return result;
}

async function _writeBuild(client, data) {
    console.log(data);
    
    const result = await client.db("mw3_gunbuilds").collection('builds').insertOne(data);
    console.log(result);
    return result;
}

async function resultHandler(result) {
    if (result.acknowledged !== true) {
        return {
            success: false,
            error: "Something went wrong..."
        };
    }

    return {
        success: true
    };
}