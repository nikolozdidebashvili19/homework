const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  

});

module.exports = mongoose.model("products", productSchema);
