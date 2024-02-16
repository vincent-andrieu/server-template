import { env } from "process";
import redis from "redis";

export type RedisClient = ReturnType<typeof redis.createClient>;

export default async function initRedis(): Promise<RedisClient> {
    const url = getRedisUrl();

    const client = redis.createClient({
        url
    });

    client.on("error", (error) =>
        console.error("Redis client error:", error)
    );
    await client.connect();

    console.info("Redis successfully connected : \n\t- Address : " +
        env.REDIS_HOST +
        "\n\t- Port : " + env.REDIS_PORT
    );
    return client;
}

function getRedisUrl(): string {
    if (env.REDIS_URL)
        return env.REDIS_URL;
    if (!env.REDIS_URL && (!env.REDIS_HOST || !env.REDIS_PORT))
        throw new Error("Missing Redis configuration");
    const baseUrl = `${env.REDIS_HOST}:${env.REDIS_PORT}`;
    const url = env.REDIS_USERNAME && env.REDIS_PASSWORD ?
        `redis://${env.REDIS_USERNAME}:${env.REDIS_PASSWORD}@${baseUrl}` :
        `redis://${baseUrl}`;

    if ((env.REDIS_USERNAME && !env.REDIS_PASSWORD) || (!env.REDIS_USERNAME && env.REDIS_PASSWORD))
        throw new Error("Invalid Redis credentials");
    return url;
}