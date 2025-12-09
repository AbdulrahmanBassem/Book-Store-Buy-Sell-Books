require("dotenv").config();
const express = require("express");
const connectDB = require("./utils/db");
const path = require("path");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const purchaseRoutes = require("./routes/purchases");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: JSON.parse(process.env.PRODUCTION_ENV)
      ? process.env.CLIENT_ORIGIN
      : "*",
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();


app.get("/", (req, res) => {
  res.send("Bookstore API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/purchases", purchaseRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
