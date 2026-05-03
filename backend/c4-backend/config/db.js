const { default: mongoose } = require("mongoose")
require('dotenv').config()


module.exports = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected successfully')

    }catch(e){
        console.log('Could not connect mongodb', e)
    }
}