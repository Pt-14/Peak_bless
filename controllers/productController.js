const fs = require("fs");

const load = () => JSON.parse(fs.readFileSync("products.json"));
const save = (data) => fs.writeFileSync("products.json", JSON.stringify(data, null, 2));

module.exports = {
  getAll(req, res) {
    try {
      const products = load();
      // Chỉ lấy các field cần thiết: Id, Name, Price, Image
      const productList = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image
      }));
      res.json(productList);
    } catch (error) {
      res.status(500).json({ error: "Không thể tải danh sách sản phẩm" });
    }
  },

  add(req, res) {
    const products = load();
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    save(products);
    res.json(newProduct);
  },

  delete(req, res) {
    const products = load();
    const newList = products.filter(p => p.id !== Number(req.params.id));
    save(newList);
    res.json({ message: "Deleted" });
  },

  update(req, res) {
    const products = load();
    const id = Number(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    products[index] = { ...products[index], ...req.body };
    save(products);
    res.json(products[index]);
  }
};
