const Purchase = require("../models/Purchase");
const Book = require("../models/Book");
const sendEmail = require("../utils/sendEmail");

exports.buyBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.bookId).populate(
      "seller",
      "name email"
    );

    // Check if book exists
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is already sold
    if (book.status === "sold") {
      return res.status(400).json({ message: "This book is already sold" });
    }

    // Prevent user from buying their own book
    if (book.seller._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot buy your own book" });
    }

    // Create Purchase Record
    const purchase = await Purchase.create({
      book: book._id,
      buyer: req.user.id,
    });

    // Mark book as sold
    book.status = "sold";
    await book.save();

    // Send Email to Seller
    try {
      await sendEmail({
        email: book.seller.email,
        subject: "Book Sold Notification",
        message: `Dear ${book.seller.name}, this is to notify you that your book "${book.title}" was sold to a new owner!`,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

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