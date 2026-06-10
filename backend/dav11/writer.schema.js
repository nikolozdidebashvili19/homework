const mongoose = require("mongoose");

const writerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    country: {
      type: String,
      trim: true,
      minlength: 2,
    },
    birthYear: {
      type: Number,
      min: 0,
      max: new Date().getFullYear(),
    },
    books: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
      ],
      default: [],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Writer", writerSchema);
