const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Purchase", PurchaseSchema);