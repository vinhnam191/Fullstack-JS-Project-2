import express, { Request, Response } from "express";
import { Product, ProductStore } from "../../models/products";
import auth from "../../middleware/auth";
const productRoute = express.Router();
const productStore = new ProductStore();

productRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await productStore.index();
    res
      .status(200)
      .json({ message: "Get list of users successfully", data: products });
  } catch (error) {
    res.status(500).send({ status: 500, message: `${error}` });
  }
});
productRoute.get("/:id", async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    if (productId && typeof productId == "number") {
      const product = await productStore.showProductInfo(productId);
      res
        .status(200)
        .json({ message: "Get product info successfully", data: product });
    } else {
      res.status(400).send({ message: "Please pass product id as a number" });
    }
  } catch (error) {
    res.status(500).send({ status: 500, message: `${error}` });
  }
});
productRoute.post("/", auth, async (req: Request, res: Response) => {
  try {
    const newProduct: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };
    if (newProduct.name && newProduct.price) {
      const createdProduct = await productStore.createProduct(newProduct);
      if (createdProduct) {
        res.status(200).json({
          message: "Create new product successfully",
          data: createdProduct,
        });
      } else {
        throw new Error("Error when created Product");
      }
    } else {
      res.status(400).send({ message: "Please input product name and price" });
    }
  } catch (error) {
    res.status(500).send({ message: `${error}` });
  }
});
productRoute.get("/category/:category", async (req: Request, res: Response) => {
  try {
    const categoryName = req.params.category;
    if (categoryName) {
      const productByCategory = await productStore.getProductByCategory(
        categoryName
      );
      res.status(200).json({
        message: "Successfully get list of products by category",
        data: productByCategory,
      });
    } else {
      res
        .status(400)
        .send({
          message: "Please pass product category that you want to search",
        });
    }
  } catch (error) {
    res.status(500).json({
      message: `${error}`,
    });
  }
});

export default productRoute;
