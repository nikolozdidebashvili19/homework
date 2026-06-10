const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    releaseYear: {
      type: Number,
      required: true,
      min: 0,
      max: new Date().getFullYear(),
    },
    genre: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    authors: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Writer",
        },
      ],
      validate: {
        validator: (authors) => Array.isArray(authors) && authors.length > 0,
        message: "Book must have at least one author.",
      },
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Book", bookSchema);
