const express = require("express");
const connectDB = require("./mongodb/main");
const Book = require("./book.schema");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post(["/books", "/books"], async (req, res) => {
  try {
    const books = req.body;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "Send an array of books." });
    }

    await connectDB();
    const savedBooks = await Book.insertMany(books);

    res.status(201).json(savedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get(["/books", "/books"], async (req, res) => {
  try {
    const filter = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.query.author) {
      filter.author = req.query.author;
    }

    if (req.query.genre) {
      filter.genre = req.query.genre;
    }

    if (req.query.releaseYear) {
      filter.releaseYear = Number(req.query.releaseYear);
    }

    await connectDB();
    const books = await Book.find(filter).skip(skip).limit(limit);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;

    await connectDB();
    const updatedBook = await Book.findByIdAndUpdate(id, newData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await connectDB();
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json({ message: "Book deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
