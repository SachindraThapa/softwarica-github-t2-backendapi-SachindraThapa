const express = require("express");
const categoryController = require("../controller/categoryController");
const routes = express.Router();

routes.get("/",categoryController.showCategory)

routes.get("/:slug",categoryController.showOneCategory)

module.exports = routes