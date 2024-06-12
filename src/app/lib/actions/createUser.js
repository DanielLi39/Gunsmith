'use server';

export default async function createUser(username, password) {
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
        const result = await client.db("mw3_gunbuilds").collection("users").insertOne({username: username, password: password});
        if (debug) console.log("Pinged your deployment. You successfully connected to MongoDB!");
        if (!result.acknowledged) {
            return {
                success: false,
                error: "Something went wrong..."
            };
        } else {
            return {
                success: true
            };
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: "Something went wrong..."
        };
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}