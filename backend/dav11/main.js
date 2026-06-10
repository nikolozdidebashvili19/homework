const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./mongodb/main");
const Book = require("./book.schema");
const Writer = require("./writer.schema");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function uniqueIds(ids) {
  return [...new Set(ids.map((id) => id.toString()))];
}

function validateIdArray(value, fieldName) {
  if (!Array.isArray(value)) {
    return `${fieldName} must be an array.`;
  }

  if (value.some((id) => !isValidObjectId(id))) {
    return `${fieldName} must contain valid MongoDB ObjectIds.`;
  }

  return null;
}

async function validateExistingIds(Model, ids, fieldName) {
  const unique = uniqueIds(ids);
  const count = await Model.countDocuments({ _id: { $in: unique } });

  if (count !== unique.length) {
    return `One or more ${fieldName} do not exist.`;
  }

  return null;
}

async function addBookToWriters(bookId, writerIds) {
  await Writer.updateMany(
    { _id: { $in: uniqueIds(writerIds) } },
    { $addToSet: { books: bookId } }
  );
}

async function syncBookWriters(bookId, oldWriterIds, newWriterIds) {
  const oldIds = uniqueIds(oldWriterIds);
  const newIds = uniqueIds(newWriterIds);

  const removedIds = oldIds.filter((id) => !newIds.includes(id));

  if (removedIds.length > 0) {
    await Writer.updateMany(
      { _id: { $in: removedIds } },
      { $pull: { books: bookId } }
    );
  }

  await addBookToWriters(bookId, newIds);
}

async function addWriterToBooks(writerId, bookIds) {
  await Book.updateMany(
    { _id: { $in: uniqueIds(bookIds) } },
    { $addToSet: { authors: writerId } }
  );
}

async function syncWriterBooks(writerId, oldBookIds, newBookIds) {
  const oldIds = uniqueIds(oldBookIds);
  const newIds = uniqueIds(newBookIds);

  const removedIds = oldIds.filter((id) => !newIds.includes(id));

  if (removedIds.length > 0) {
    await Book.updateMany(
      { _id: { $in: removedIds } },
      { $pull: { authors: writerId } }
    );
  }

  if (newIds.length > 0) {
    await addWriterToBooks(writerId, newIds);
  }
}

async function findBooksThatWouldHaveNoAuthors(writerId, bookIds) {
  const filter = { authors: writerId };

  if (bookIds !== undefined) {
    filter._id = { $in: bookIds };
  }

  const books = await Book.find(filter).select("name authors");

  return books.filter((book) => book.authors.length <= 1);
}

function validateBookPayload(book) {
  if (!book || typeof book !== "object" || Array.isArray(book)) {
    return "Book must be an object.";
  }

  if (!book.name || typeof book.name !== "string" || book.name.trim().length < 2) {
    return "Book name is required and must be at least 2 characters.";
  }

  if (
    !Number.isInteger(book.releaseYear) ||
    book.releaseYear < 0 ||
    book.releaseYear > new Date().getFullYear()
  ) {
    return "Book releaseYear must be a valid year.";
  }

  if (!book.genre || typeof book.genre !== "string" || book.genre.trim().length < 2) {
    return "Book genre is required and must be at least 2 characters.";
  }

  if (!Array.isArray(book.authors) || book.authors.length === 0) {
    return "Book authors is required and must contain at least one writer id.";
  }

  return validateIdArray(book.authors, "Book authors");
}

function validateBookUpdatePayload(book) {
  if (!book || typeof book !== "object" || Array.isArray(book)) {
    return "Book update must be an object.";
  }

  if (
    book.name !== undefined &&
    (typeof book.name !== "string" || book.name.trim().length < 2)
  ) {
    return "Book name must be at least 2 characters.";
  }

  if (
    book.releaseYear !== undefined &&
    (!Number.isInteger(book.releaseYear) ||
      book.releaseYear < 0 ||
      book.releaseYear > new Date().getFullYear())
  ) {
    return "Book releaseYear must be a valid year.";
  }

  if (
    book.genre !== undefined &&
    (typeof book.genre !== "string" || book.genre.trim().length < 2)
  ) {
    return "Book genre must be at least 2 characters.";
  }

  if (book.authors !== undefined) {
    if (!Array.isArray(book.authors) || book.authors.length === 0) {
      return "Book authors must contain at least one writer id.";
    }

    return validateIdArray(book.authors, "Book authors");
  }

  return null;
}

function validateWriterPayload(writer) {
  if (!writer || typeof writer !== "object" || Array.isArray(writer)) {
    return "Writer must be an object.";
  }

  if (!writer.name || typeof writer.name !== "string" || writer.name.trim().length < 2) {
    return "Writer name is required and must be at least 2 characters.";
  }

  if (
    writer.country !== undefined &&
    (typeof writer.country !== "string" || writer.country.trim().length < 2)
  ) {
    return "Writer country must be at least 2 characters.";
  }

  if (
    writer.birthYear !== undefined &&
    (!Number.isInteger(writer.birthYear) ||
      writer.birthYear < 0 ||
      writer.birthYear > new Date().getFullYear())
  ) {
    return "Writer birthYear must be a valid year.";
  }

  if (writer.books !== undefined) {
    return validateIdArray(writer.books, "Writer books");
  }

  return null;
}

function validateWriterUpdatePayload(writer) {
  if (!writer || typeof writer !== "object" || Array.isArray(writer)) {
    return "Writer update must be an object.";
  }

  return validateWriterPayload({ name: "Valid writer", ...writer });
}

app.post("/books", async (req, res) => {
  try {
    const books = req.body;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ message: "Send an array of books." });
    }

    for (const book of books) {
      const validationError = validateBookPayload(book);

      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
    }

    await connectDB();

    const authorIds = books.flatMap((book) => book.authors);
    const existingAuthorsError = await validateExistingIds(
      Writer,
      authorIds,
      "authors"
    );

    if (existingAuthorsError) {
      return res.status(400).json({ message: existingAuthorsError });
    }

    const savedBooks = await Book.insertMany(books);

    for (const savedBook of savedBooks) {
      await addBookToWriters(savedBook._id, savedBook.authors);
    }

    res.status(201).json(savedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const filter = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.query.author) {
      if (!isValidObjectId(req.query.author)) {
        return res.status(400).json({ message: "author must be a valid ObjectId." });
      }

      filter.authors = req.query.author;
    }

    if (req.query.genre) {
      filter.genre = req.query.genre;
    }

    if (req.query.releaseYear) {
      filter.releaseYear = Number(req.query.releaseYear);
    }

    await connectDB();
    const books = await Book.find(filter).populate("authors").skip(skip).limit(limit);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Book id must be a valid ObjectId." });
    }

    const validationError = validateBookUpdatePayload(newData);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await connectDB();
    const oldBook = await Book.findById(id);

    if (!oldBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (newData.authors !== undefined) {
      const existingAuthorsError = await validateExistingIds(
        Writer,
        newData.authors,
        "authors"
      );

      if (existingAuthorsError) {
        return res.status(400).json({ message: existingAuthorsError });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true,
    }).populate("authors");

    if (newData.authors !== undefined) {
      await syncBookWriters(id, oldBook.authors, newData.authors);
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Book id must be a valid ObjectId." });
    }

    await connectDB();
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    await Writer.updateMany(
      { books: deletedBook._id },
      { $pull: { books: deletedBook._id } }
    );

    res.json({ message: "Book deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/writers", async (req, res) => {
  try {
    const writers = Array.isArray(req.body) ? req.body : [req.body];

    if (writers.length === 0) {
      return res.status(400).json({ message: "Send writer data." });
    }

    for (const writer of writers) {
      const validationError = validateWriterPayload(writer);

      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
    }

    await connectDB();

    const bookIds = writers.flatMap((writer) => writer.books || []);

    if (bookIds.length > 0) {
      const existingBooksError = await validateExistingIds(Book, bookIds, "books");

      if (existingBooksError) {
        return res.status(400).json({ message: existingBooksError });
      }
    }

    const savedWriters = await Writer.insertMany(writers);

    for (const savedWriter of savedWriters) {
      if (savedWriter.books.length > 0) {
        await addWriterToBooks(savedWriter._id, savedWriter.books);
      }
    }

    res.status(201).json(Array.isArray(req.body) ? savedWriters : savedWriters[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/writers", async (req, res) => {
  try {
    const filter = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    if (req.query.country) {
      filter.country = req.query.country;
    }

    if (req.query.book) {
      if (!isValidObjectId(req.query.book)) {
        return res.status(400).json({ message: "book must be a valid ObjectId." });
      }

      filter.books = req.query.book;
    }

    await connectDB();
    const writers = await Writer.find(filter).populate("books").skip(skip).limit(limit);

    res.json(writers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/writers/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Writer id must be a valid ObjectId." });
    }

    await connectDB();
    const writer = await Writer.findById(id).populate("books");

    if (!writer) {
      return res.status(404).json({ message: "Writer not found." });
    }

    res.json(writer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/writers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newData = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Writer id must be a valid ObjectId." });
    }

    const validationError = validateWriterUpdatePayload(newData);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await connectDB();
    const oldWriter = await Writer.findById(id);

    if (!oldWriter) {
      return res.status(404).json({ message: "Writer not found." });
    }

    if (newData.books !== undefined) {
      const existingBooksError = await validateExistingIds(Book, newData.books, "books");

      if (existingBooksError) {
        return res.status(400).json({ message: existingBooksError });
      }

      const oldBookIds = uniqueIds(oldWriter.books);
      const newBookIds = uniqueIds(newData.books);
      const removedBookIds = oldBookIds.filter((bookId) => !newBookIds.includes(bookId));
      const booksWithoutAuthors = await findBooksThatWouldHaveNoAuthors(
        id,
        removedBookIds
      );

      if (booksWithoutAuthors.length > 0) {
        return res.status(400).json({
          message: "Cannot remove this writer from books that have no other authors.",
          books: booksWithoutAuthors.map((book) => book.name),
        });
      }
    }

    const updatedWriter = await Writer.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true,
    }).populate("books");

    if (newData.books !== undefined) {
      await syncWriterBooks(id, oldWriter.books, newData.books);
    }

    res.json(updatedWriter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/writers/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Writer id must be a valid ObjectId." });
    }

    await connectDB();
    const writer = await Writer.findById(id);

    if (!writer) {
      return res.status(404).json({ message: "Writer not found." });
    }

    const booksWithoutAuthors = await findBooksThatWouldHaveNoAuthors(id);

    if (booksWithoutAuthors.length > 0) {
      return res.status(400).json({
        message: "Cannot delete writer because some books have no other authors.",
        books: booksWithoutAuthors.map((book) => book.name),
      });
    }

    const deletedWriter = await Writer.findByIdAndDelete(id);

    await Book.updateMany(
      { authors: deletedWriter._id },
      { $pull: { authors: deletedWriter._id } }
    );

    res.json({ message: "Writer deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
