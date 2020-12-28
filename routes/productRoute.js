const express = require("express");
const productController = require("../controller/productController");
const routes = express.Router();
const auth = require('../middlewares/auth');

routes.get("/",productController.showProduct)
routes.get("/filter",productController.filteredProducts)
routes.get("/count", productController.countProduct)

routes.get("/:slug",productController.singleProduct)
routes.post("/:slug/cart",auth.verifyUser,productController.prodBook)

module.exports = routes