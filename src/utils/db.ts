import mongoose from "mongoose";
import { config } from "./config";
import { logger } from "./logger";

export async function connectDb (){

    try {
        await mongoose.connect(config.DATABASE_URL)
        logger.info(`Connected to database`)
    } catch (e) {
        logger.error(e)
        process.exit(1)
        
    }
}

export async function disconnectDb(){
return mongoose.connection.close()
}