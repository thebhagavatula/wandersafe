// const mongoose = require('mongoose');  

// const connectDB = async () => {  
//   try {  
//     await mongoose.connect(process.env.MONGO_URI, {  
//       useNewUrlParser: true,  
//       useUnifiedTopology: true,  
//     });  
//     console.log('MongoDB Connected');  
//   } catch (err) {  
//     console.error('MongoDB Connection Error:', err);  
//     process.exit(1);  
//   }  
// };  

module.exports = connectDB;

import mongoose  from "mongoose";

const db = async () => {
    mongoose.connection.on('connected', () => 
    console.log("Connected to MongoDB"));
    mongoose.connection.on('error', (err) =>
    console.log("Error connecting to MongoDB", err));
    await mongoose.connect(`${process.env.MONGO_URI}/auth`);
};

export default db;
