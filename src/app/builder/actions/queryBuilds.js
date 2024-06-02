'use server';

import connect from "./connect";

/*
import { MongoClient } from "mongodb";
import { ServerApiVersion } from "mongodb";

async function readData(client, author, name, gun, attachments, all) {
    //const [author, name, gun, attachments] = parameters;

    const query = {};

    (author !== '') ? (query.author = author) : "";
    (name !== '') ? (query.name = name) : "";
    (gun !== '') ? (query.gunName = gun) : "";
    (attachments.length !== 0) ? 
        (all ? (query.attachments = { $all: attachments }) : (query.attachments = { $in: attachments }))
        : "";

    console.log(query);

    const result = await client.db("mw3_gunbuilds").collection("builds").find(query);

    const arr = await result.toArray();
    arr.forEach(doc => doc._id = doc._id.toString());
    return arr;
}

async function connect(author, name, gun, attachments, all) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    async function run(author, name, gun, attachments, all) {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            console.log("Client connected!");
            // Send a ping to confirm a successful connection
            const result = await readData(client, author, name, gun, attachments, all);
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
    const result = await run(author, name, gun, attachments, all);
    return result;
}
*/
export default async function queryBuilds(parameters) {
    const cursor = await connect(_queryBuilds, parameters, resultHandler, false);
    return cursor;
}

async function _queryBuilds(client, parameters) {
    console.log(parameters);
    var attachmentList = [];
    if (parameters.attachments !== '') {
        parameters.attachments.split(',').forEach((val) => attachmentList.push(val.trim()));
    }
    const query = {};

    (parameters.author !== '') ? (query.author = parameters.author) : "";
    (parameters.name !== '') ? (query.name = parameters.name) : "";
    (parameters.gun !== '') ? (query.gunName = parameters.gun) : "";
    (attachmentList.length !== 0) ? 
        (parameters.all ? (query.attachments = { $all: attachmentList }) : (query.attachments = { $in: attachmentList }))
        : "";

    console.log(query);

    const result = await client.db("mw3_gunbuilds").collection("builds").find(query);

    const arr = await result.toArray();
    arr.forEach(doc => doc._id = doc._id.toString());
    return arr;
}

async function resultHandler(result) {
    if (result === null) {
        return {
            success: false,
            error: "No such gun found."
        };
    }
    
    return {
        success: true,
        data: result
    };
}