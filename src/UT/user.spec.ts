import { UserStore } from "../models/users";
import dotenv from "dotenv";
import app from "../server";
import supertest from "supertest";
import axios from "axios";

let http = supertest.agent(app);
const backendServer = "http://localhost:3000/api";
dotenv.config();
const store = new UserStore();
describe("Testing User model", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have showInfo method", () => {
    expect(store.showUserInfo).toBeDefined();
  });

  it("should have create User method", () => {
    expect(store.createUser).toBeDefined();
  });

  it("should have authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });
});
describe("Testing User Enpoints", () => {
  const loginURL = `${backendServer}/users/authenticate`;
  const payloadLogin = {
    userName: "user.test",
    password: "user123",
  };
  let newUser;
  let token;
  let config: object;

  beforeAll(async () => {
    try {
      const createdUser = {
        first_name: "Login",
        last_name: "User",
        userName: "user.test",
        password: "user123",
      };
      newUser = await axios.post(`${backendServer}/users/signUp`, createdUser);
      //@ts-ignore
      token = signUpProduct.data.data;
      config = {
        headers: { Authorization: `Bearer ${token}` },
      };
    } catch (error) {
      console.log("error");
    }
  });

  it("Testing login method return token", async () => {
    const result = await axios.post(loginURL, payloadLogin);
    //@ts-ignore
    expect(result.data.token).toBeDefined();
  }),
    it("should let user sign up succesfully", async () => {
      const singUpUser = {
        first_name: "Tu",
        last_name: "Nguyen Hoang",
        userName: "tu.nguyenhoang",
        password: "admin123",
      };
      const url = `${backendServer}/users/signUp`;
      const result = await axios.post(url, singUpUser);
      expect(result.status).toBe(200);
    });

  it("Index should require token and return value", async () => {
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    let config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const indexValue = await axios.get(`${backendServer}/users`, config);
    //@ts-ignore
    expect(indexValue.status).toBe(200);
  });

  it("should let user create new user succesfully and require token", async () => {
    const singUpUser = {
      first_name: "Tom",
      last_name: "Holland",
      userName: "tom.holland",
      password: "tom123",
    };
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    let config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const url = `${backendServer}/users/`;
    const result = await axios.post(url, singUpUser, config);
    expect(result.status).toBe(200);
  });

  it("should show user info and require token", async () => {
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    let config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const userId = 1;
    const indexValue = await axios.get(
      `${backendServer}/users/${userId}`,
      config
    );
    expect(indexValue.data.data.id).toEqual(userId);
  });
});
