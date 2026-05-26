const { default: mongoose } = require("mongoose")
require('dotenv').config()
module.exports =async( )=> {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('connected succesfully') 
    } catch (e) {
        console.log('couldnt connect to db')
    }
}