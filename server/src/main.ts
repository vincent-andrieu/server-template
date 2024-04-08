import "dotenv/config";
import "module-alias/register.js";

import HealthRoutes from "@api/health";
import initExpress from "./init/express";
import initMongo from "./init/mongo";
import initRedis from "./init/redis";
import AuthentificationMiddleware from "./middlewares/authentification";
import { errorLoggerMiddleware, loggerMiddleware } from "./middlewares/logger";

async function main() {
    console.log("Server starting...");
    initMongo();
    const redisClient = await initRedis();
    const app = await initExpress(redisClient);
    const authentificationMiddleware = new AuthentificationMiddleware();

    // Middlewares
    app.use(loggerMiddleware);
    app.use(authentificationMiddleware.handler.bind(authentificationMiddleware));

    // Routes
    new HealthRoutes(app, authentificationMiddleware.whitelistRoute);

    // Error middlewares
    app.use(errorLoggerMiddleware);
}

main();
