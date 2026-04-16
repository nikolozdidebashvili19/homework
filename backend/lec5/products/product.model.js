const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  desc: {
    type: String,
  },
  review: {
    type: Number,
    default: 5,
  },
});

module.exports = mongoose.model("products", productSchema);
