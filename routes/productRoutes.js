const router = require("express").Router();
const product = require("../controllers/productController");

router.get("/", product.getAll);
router.post("/", product.add);
router.delete("/:id", product.delete);
router.put("/:id", product.update);

module.exports = router;
