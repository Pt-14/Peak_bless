const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
