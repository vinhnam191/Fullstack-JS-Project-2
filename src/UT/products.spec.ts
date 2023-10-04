import { ProductStore } from "../models/products";
import dotenv from "dotenv";
import axios from "axios";
import app from "../server";
import supertest from "supertest";
let http = supertest.agent(app);
const backendServer = "http://localhost:3000/api";
dotenv.config();
const store = new ProductStore();
describe("Testing Product model", () => {
  it("Should have an index method", () => {
    expect(store.index).toBeDefined;
  });

  it("should have showInfo method", () => {
    expect(store.showProductInfo).toBeDefined();
  });

  it("should have create Product method", () => {
    expect(store.createProduct).toBeDefined();
  });

  it("should have getProductByCategory method", () => {
    expect(store.getProductByCategory).toBeDefined();
  });
});
describe("Testing Product Endpoint", () => {
  let signUpProduct;
  const loginURL = `${backendServer}/users/authenticate`;
  const payloadLogin = {
    userName: "product.test",
    password: "product123",
  };

  beforeAll(async () => {
    try {
      const ProductUser = {
        first_name: "Product",
        last_name: "User",
        userName: "product.test",
        password: "product123",
      };
      signUpProduct = await axios.post(
        `${backendServer}/users/signUp`,
        ProductUser
      );
    } catch (error) {
      console.log("error");
    }

    try {
      const newProduct = {
        name: "Macbook",
        price: 200000,
        category: "Laptop",
      };
      const login = await axios.post(loginURL, payloadLogin);
      const loginToken = login.data.token;
      let config = {
        headers: { Authorization: `Bearer ${loginToken}` },
      };
      const result = await axios.post(
        `${backendServer}/products`,
        newProduct,
        config
      );
    } catch (err) {
      console.log(err);
    }
  });

  it("should return list of products successfully", async () => {
    const result = await axios.get(`${backendServer}/products`);
    // @ts-ignore
    expect(result.status).toBe(200);
  });

  it("should return product info by product id ", async () => {
    const productId = 1;
    const result = await axios.get(`${backendServer}/products/${productId}`);
    expect(result.status).toBe(200);
  });

  it("should create new product and require token", async () => {
    const newProduct = {
      name: "Macbook",
      price: 200000,
      category: "Laptop",
    };
    const url = `${backendServer}/products/`;
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    let config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const result = await axios.post(url, newProduct, config);
    expect(result.status).toBe(200);
  });

  it("should get list of products by category", async () => {
    let categoryName = "Laptop";
    const listProduct = await axios.get(
      `${backendServer}/products/category/${categoryName}`
    );
    expect(listProduct.data.data[0].category).toEqual(categoryName);
  });
});
