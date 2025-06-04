import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';


if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// create a global variable to hold the mongoose instance
// to prevent multiple connections in development mode
let cached = global.mongoose


//if not present, create a new cached object and assign a new connection to it
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDb() {
    // if the cached connection is already established, return it
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: 'mockapi',
            bufferCommands: false,
        }).then((mongoose) => mongoose)
    }

    cached.conn = await cached.promise;
    return cached.conn
}