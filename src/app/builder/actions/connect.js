import { MongoClient } from "mongodb";
import { ServerApiVersion } from "mongodb";

//Generic connect function to execute a query to the database
export default async function connect(query, parameters, resultHandler, debug) {
    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    async function run(query, parameters, resultHandler, debug) {
        try {
            await client.connect();
            if (debug) console.log("Client connected!");
            const result = await query(client, parameters);
            if (debug) console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return resultHandler(result);
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
    const result = await run(query, parameters, resultHandler, debug);
    return result;
}