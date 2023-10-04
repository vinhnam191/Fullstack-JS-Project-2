import express, { Request, Response } from "express";
import auth from "../../middleware/auth";
import { OrderStore, Order } from "../../models/orders";
const orderRoute = express.Router();
const orderStore = new OrderStore();

orderRoute.get("/", async (_req: Request, res: Response) => {
  try {
    const oders = await orderStore.index();
    res
      .status(200)
      .json({ message: "Get list of oders successfully", data: oders });
  } catch (error) {
    res.status(500).send({ status: 500, message: `${error}` });
  }
});

orderRoute.get("/user/:userId", auth, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (userId && typeof userId == "number") {
      const orders = await orderStore.getOrdersByUser(userId);
      res
        .status(200)
        .json({
          message: "Get orders info by user successfully",
          data: orders,
        });
    } else {
      res.status(400).send({ message: "Please pass user id as a number" });
    }
  } catch (error) {
    res.status(500).send({ status: 500, message: `${error}` });
  }
});
orderRoute.get(
  "/user/:userId/order",
  auth,
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (userId && typeof userId == "number") {
        const orders = await orderStore.getCompletedOrdersByUser(userId);
        res
          .status(200)
          .json({
            message: "Get orders complete by user successfully",
            data: orders,
          });
      } else {
        res.status(400).send({ message: "Please pass user id as a number" });
      }
    } catch (error) {
      res.status(500).send({ status: 500, message: `${error}` });
    }
  }
);
orderRoute.post("/", auth, async (req: Request, res: Response) => {
  try {
    // status is active as default when we created a new order
    // if the order is complete we will call another endpoint to update the status
    const newOrder: Order = {
      product_id: parseInt(req.body.product_id),
      user_id: parseInt(req.body.user_id),
      quantity: req.body.quantity,
      status: "active",
    };
    if (newOrder.product_id && newOrder.user_id && newOrder.quantity) {
      if (newOrder.quantity <= 0) {
        res
          .status(400)
          .send({
            message: "Please input quantity of product as positive numbers",
          });
      }
      const createdOrder = await orderStore.createOrder(newOrder);
      if (createdOrder) {
        res.status(200).json({
          message: "Create new order successfully",
          data: createdOrder,
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
orderRoute.put("/:id", auth, async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    if (orderId && typeof orderId == "number") {
      const orders = await orderStore.updateStatusOfOrder(orderId);
      res
        .status(200)
        .json({
          message: "Update status of order to complete successfully",
          data: orders,
        });
    } else {
      res.status(400).send({ message: "Please pass order id as a number" });
    }
  } catch (error) {
    res.status(500).send({ status: 500, message: `${error}` });
  }
});

export default orderRoute;
