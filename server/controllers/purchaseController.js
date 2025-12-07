const Purchase = require("../models/Purchase");
const Book = require("../models/Book");

exports.buyBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId);

    // 1. Check if book exists
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 2. Check if book is already sold
    if (book.status === "sold") {
      return res.status(400).json({ message: "This book is already sold" });
    }

    // 3. Prevent user from buying their own book
    if (book.seller.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot buy your own book" });
    }

    // 4. Create Purchase Record
    const purchase = await Purchase.create({
      book: book._id,
      buyer: req.user.id,
    });

    // 5. Mark book as sold
    book.status = "sold";
    await book.save();

    // 6. Simulate Notification 
    console.log(
      `Notification: User ${book.seller} was notified that "${book.title}" was sold.`
    );

    res.status(201).json({
      success: true,
      message: "Purchase successful",
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};


exports.getPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user.id })
      .populate({
        path: "book",
        select: "title author price image condition", 
        populate: {
          path: "seller",
          select: "name email", 
        },
      })
      .sort("-purchaseDate"); 

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};