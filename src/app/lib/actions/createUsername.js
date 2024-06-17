'use server';

import { MongoClient, ServerApiVersion } from "mongodb";
import { redirect } from "next/navigation";

export default async function createUsername(previousState, formData) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        console.log(formData);
        //Check if username taken or not
        const exists = await client.db("mw3_gunbuilds").collection("users").findOne({username: formData.get("username")});
        console.log(exists);
        if (exists) {
            previousState = {
                success: false,
                error: "Username already taken"
            };
            return;
        }
        

        const result = await client.db("mw3_gunbuilds").collection("users").insertOne({email: formData.get("email"), username: formData.get("username")});
        console.log(result);
        if (!result.acknowledged) {
            previousState = {
                success: false,
                error: "Something went wrong..."
            };
            return;
        }
    } catch (error) {
        console.log(error);
        previousState = {
            success: false,
            error: "Something went wrong..."
        };
        return;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    redirect('/');
}