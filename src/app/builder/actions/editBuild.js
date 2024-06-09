'use server';

import connect from "./connect";
import { ObjectId } from "mongodb";

export default async function editBuild(parameters) {
    const result = await connect(_editBuild, parameters, resultHandler, false);
    return result;
}

async function _editBuild(client, parameters) {
    const objId = ObjectId.createFromHexString(parameters.id);

    const query = structuredClone(parameters);
    delete query.id;
    delete query.blocks;
    delete query.edit;
    query.attachments = parameters.attachments.map(a => a.name);

    console.log(query);
    const result = await client.db("mw3_gunbuilds").collection('builds').updateOne({_id: objId}, {$set: query});
    console.log(result);
    return result;
}

async function resultHandler(result) {
    console.log(result);
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