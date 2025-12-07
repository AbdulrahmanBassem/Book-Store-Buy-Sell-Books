const Book = require("../models/Book");

exports.getBooks = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    
    // Search logic
    let query = {};
    if (keyword) {
      query = {
        $or: [
          { title: { $regex: keyword, $options: "i" } }, 
          { author: { $regex: keyword, $options: "i" } }, 
        ],
      };
    }

    // Return available books
    query.status = "available";

    const books = await Book.find(query).populate("seller", "name email");

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};


exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};


exports.createBook = async (req, res, next) => {
  try {
    // Add seller 
    req.body.seller = req.user.id;

    // Handle image upload 
    if (req.file) {
      req.body.image = req.file.path; 
    }

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Make sure user is book owner
    if (book.seller.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized to update this book",
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Make sure user is book owner
    if (book.seller.toString() !== req.user.id) {
      return res.status(401).json({
        message: "Not authorized to delete this book",
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};