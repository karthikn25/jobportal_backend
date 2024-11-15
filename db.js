const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config()


const connectDataBase = async()=>{

    const params = {
        useUnifiedTopology:true,
        useNewUrlParser:true
    }
    try {
        mongoose.connect(process.env.MONGO_URL,params)
        console.log("MongoDb connected Successfully")
        
    } catch (error) {
        console.log("Mongodb connection error",error)
    }
}

module.exports = {connectDataBase}