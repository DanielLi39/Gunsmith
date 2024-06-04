'use server';

import connect from "./connect";

export default async function queryGuns(parameters) {
    const result = await connect(_queryGuns, parameters, resultHandler, false);
    return result;
}

async function _queryGuns(client, parameters) {
    const query = [];
    const first_match = {
        "$match": {}
    };
    const addField = {
        "$addFields": {
            "attachment_list": {
                "$reduce": {
                    "input": {
                        "$map": {
                            "input": {
                                "$objectToArray": {
                                    "$ifNull": ["$attachments", {}]}
                            },
                            "as": "attachment",
                            "in": "$$attachment.v.name"
                        }
                    },
                    "initialValue": [],
                    "in": {
                        "$concatArrays": [
                            "$$value",
                            "$$this"
                        ]
                    }
                }
            }
        }
    };
    const attachment_match = {
        "$match": {"attachment_list": {}}
    };
    var attachmentList = [];
    if (parameters.gun.attachments !== '') {
        parameters.gun.attachments.split(',').forEach((val) => attachmentList.push(val.trim()));
    }

    var actionList = [];
    if (parameters.gun.action !== '') {
        parameters.gun.action.split(',').forEach((val) => actionList.push(val.trim()));
    }

    var caliberList = [];
    if (parameters.gun.caliber !== '') {
        parameters.gun.caliber.split(',').forEach((val) => caliberList.push(val.trim()));
    }

    (parameters.gun.name !== '') ? first_match.$match.name = parameters.gun.name : "";
    (parameters.gun.type !== '') ? first_match.$match.type = parameters.gun.type : "";
    (parameters.gun.action !== '') ? 
        (parameters.gun.action_all ? (first_match.$match.actions = { $all: actionList }) : (first_match.$match.actions = { $in: actionList }))
        : "";
    (parameters.gun.caliber !== '') ?
        (parameters.gun.caliber_all ? (first_match.$match.caliber = { $all: caliberList }) : (first_match.$match.caliber = { $in: caliberList }))
        : "";
    
    query.push(first_match);

    if (parameters.gun.attachments !== '') {
        (parameters.gun.attachments_all ? (attachment_match.$match.attachment_list = { $all: attachmentList }) : (attachment_match.$match.attachment_list = { $in: attachmentList }))
        query.push(addField);
        query.push(attachment_match);
    }
    
    console.log(query, query[0].$match.actions);
    const result = await client.db("mw3_gunbuilds").collection("guns").aggregate(query);
    const arr = await result.toArray();
    arr.forEach(doc => doc._id = doc._id.toString());
    console.log(arr)
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