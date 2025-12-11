const Product = require("../models/Product");

module.exports = {
  async getAll(req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
    } catch (error) {
      console.error("Error loading products:", error);
      res.status(500).json({ error: "Error loading products" });k
    }
  },

  async add(req, res) {
    try {
      const { name, price, image } = req.body;
      const newProduct = new Product({
        name,
        price,
        image
      });
      const savedProduct = await newProduct.save();
      res.json(savedProduct);
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Error adding product" });
    }
  },

  async delete(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Deleted" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Error deleting product" });
    }
  },

  async update(req, res) {
    try {
      const { name, price, image } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, image },
        { new: true, runValidators: true }
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Error updating product" });
    }
  }
};
