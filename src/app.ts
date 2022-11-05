import { config } from "./utils/config"
import { createServer } from "./utils/createServer"
import { connectDb, disconnectDb } from "./utils/db"
import { logger } from "./utils/logger"

const signals = ["SIGINT","SIGTERM","SIGHUP"] as const; //thi makes sure signal is one of these

async function gracefulShutdown({
    signal,
    server
}:{signal:typeof signals[number],
    server: Awaited <ReturnType<typeof createServer>>//createserver should return a promise -> by async createServer server will be Promise
}){
    logger.info(`Got signal ${signal}. Goodbye`)
    await server.close()
    await disconnectDb()
    process.exit(0)
}

async function startServer() {

    const server = await createServer()
    server.listen({
        port:config.PORT,
        host:config.HOST //for docker bcoz it doesnt know localhost
    })
    await connectDb()
    logger.info(`App is listening at`)

    for (let i =0;i < signals.length;i++){
        process.on(signals[i],()=>
            gracefulShutdown({
                signal:signals[i],
                server
    }))
    }
}

startServer()