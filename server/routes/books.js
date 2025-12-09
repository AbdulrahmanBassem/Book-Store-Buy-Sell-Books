const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); 
const {
  getBooks,
  getBook, 
  createBook,
  updateBook,
  deleteBook,
  getMyBooks,
} = require("../controllers/bookController");

// Public routes
router.get("/", getBooks);
router.get("/my-books", auth, getMyBooks);
router.get("/:id", getBook);

// Protected routes 
router.post("/", auth, upload.single("image"), createBook);

router.put("/:id", auth, upload.single("image"), updateBook);
router.delete("/:id", auth, deleteBook);

module.exports = router;