import mongoose from "mongoose";
import { cache } from "react";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    }
}

export const connectDB = async () => {
    if(cached.conn) {
        return cached.conn;
    }
    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "next-commerce",
            bufferCommands: false,
        })
    }

    cached.conn = await cached.promise;
    return cached.conn;
}