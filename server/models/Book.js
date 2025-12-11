const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Please add an author"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  condition: {
    type: String,
    enum: ["New", "Like New", "Good", "Fair", "Poor"],
    required: [true, "Please specify the condition"],
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    enum: ["Fiction", "Non-Fiction", "Science", "Technology", "History", "Biography", "Business", "Other"],
    default: "Other"
  },
  stock: {
    type: Number,
    required: [true, "Please add stock quantity"],
    min: 0,
    default: 1,
  },
  image: {
    type: String, 
    default: "no-photo.jpg",
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Book", BookSchema);