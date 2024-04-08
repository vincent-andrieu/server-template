import mongoose from "mongoose";
import { env } from "process";

mongoose.set("strictQuery", false);

export default async function initMongo(): Promise<void> {
    const url = getMongoUrl();

    try {
        console.log("Connecting to database...");
        await mongoose.connect(url);
    } catch (error) {
        throw new Error("Database connection failed");
    }
    console.info(
        "Mongo successfully connected : \n\t- Address : " +
            env.MONGO_HOST +
            "\n\t- Port : " +
            env.MONGO_PORT +
            "\n\t- Name : " +
            env.MONGO_DB_NAME
    );
}

function getMongoUrl(): string {
    if (env.MONGO_URL) {
        return env.MONGO_URL;
    }
    if (!env.MONGO_URL && (!env.MONGO_HOST || !env.MONGO_PORT || !env.MONGO_DB_NAME)) {
        throw new Error("Missing database configuration");
    }
    const baseUri = `${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB_NAME}`;
    const uri =
        env.MONGO_USERNAME && env.MONGO_PASSWORD
            ? `mongodb://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${baseUri}?authSource=admin`
            : `mongodb://${baseUri}`;

    if ((env.MONGO_USERNAME && !env.MONGO_PASSWORD) || (!env.MONGO_USERNAME && env.MONGO_PASSWORD)) {
        throw new Error("Invalid database credentials");
    }
    return uri;
}
