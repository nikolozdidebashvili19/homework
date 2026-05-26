const { Schema, default: mongoose } = require("mongoose");


const userSchema = new Schema({
    name: {
        type:String , 
        require:true
    }, 
    age: {
        type:Number , 
        required: true
    }
})

module.exports = mongoose.model('users', userSchema)