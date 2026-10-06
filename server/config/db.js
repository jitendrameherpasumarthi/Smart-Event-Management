import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return true;
  }

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub_db';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000, // Quick timeout if database server is not running
      connectTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB Connection Notice: Could not connect to database at ${uri}.`);
    console.warn(`👉 Details: ${error.message}`);
    console.warn(`💡 Note: If using MongoDB Atlas or a remote server, please update MONGO_URI in server/.env.`);
    return false;
  }
};

export const getDBStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    host: mongoose.connection.host || 'none',
    name: mongoose.connection.name || 'none'
  };
};

export default connectDB;
