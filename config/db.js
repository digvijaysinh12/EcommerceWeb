import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDb connected Successfully ${conn.connection.host}` .green .bgWhite);
    } catch(error){
        console.log(`Error in Mongodb ${error}` .bgRed);
    }
}  

export default connectDB;