const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'products',
        default: []
    }
})

module.exports = mongoose.model('user', userSchema)