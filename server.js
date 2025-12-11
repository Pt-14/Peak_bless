const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");

// Kết nối MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/products", productRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
