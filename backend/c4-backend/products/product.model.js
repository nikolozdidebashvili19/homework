const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    desc: {
        type: String
    },
    review: {
        type: Number,
        default: 5
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    }
})

module.exports = mongoose.model('products', productSchema)