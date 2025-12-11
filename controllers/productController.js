const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "../products.json");

const load = () => {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf-8"));
  } catch (error) {
    return [];
  }
};

const save = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = {
  // Lấy tất cả sản phẩm
  getAll(req, res) {
    try {
      const products = load();
      const productList = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image || ""
      }));
      res.json(productList);
    } catch (error) {
      console.error("Error in getAll:", error);
      res.status(500).json({ error: "Không thể tải danh sách sản phẩm" });
    }
  },

  // Thêm sản phẩm mới
  add(req, res) {
    try {
      const { name, price, image } = req.body;

      // Kiểm tra dữ liệu
      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Tên sản phẩm không được để trống" });
      }
      if (!price || price < 0) {
        return res.status(400).json({ error: "Giá phải là số dương" });
      }

      const products = load();
      const newProduct = {
        id: Date.now(),
        name: name.trim(),
        price: Number(price),
        image: image || ""
      };

      products.push(newProduct);
      save(products);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error in add:", error);
      res.status(500).json({ error: "Không thể thêm sản phẩm" });
    }
  },

  // Xóa sản phẩm
  delete(req, res) {
    try {
      const { id } = req.params;
      const products = load();
      const productIndex = products.findIndex(p => p.id === Number(id));

      if (productIndex === -1) {
        return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
      }

      products.splice(productIndex, 1);
      save(products);
      res.json({ message: "Xóa sản phẩm thành công", id: Number(id) });
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({ error: "Không thể xóa sản phẩm" });
    }
  },

  // Cập nhật sản phẩm
  update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, image } = req.body;

      // Kiểm tra dữ liệu
      if (name && !name.trim()) {
        return res.status(400).json({ error: "Tên sản phẩm không được để trống" });
      }
      if (price && price < 0) {
        return res.status(400).json({ error: "Giá phải là số dương" });
      }

      const products = load();
      const productIndex = products.findIndex(p => p.id === Number(id));

      if (productIndex === -1) {
        return res.status(404).json({ error: "Sản phẩm không tìm thấy" });
      }

      // Cập nhật thông tin
      if (name) products[productIndex].name = name.trim();
      if (price !== undefined) products[productIndex].price = Number(price);
      if (image !== undefined) products[productIndex].image = image || "";

      save(products);
      res.json({ message: "Cập nhật sản phẩm thành công", product: products[productIndex] });
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json({ error: "Không thể cập nhật sản phẩm" });
    }
  }
};
