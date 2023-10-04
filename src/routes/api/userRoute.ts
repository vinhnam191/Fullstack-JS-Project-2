import express, { Request, Response } from "express";
import { User, UserStore } from "../../models/users";
import auth from "../../middleware/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userRoute = express.Router();
const userStore = new UserStore();
const serect = String(process.env.SECRET_TOKEN);
// get list of users
userRoute.get("/", auth, async (req: Request, res: Response) => {
  try {
    const authorizeHeader = req.headers.authorization;
    const token = String(authorizeHeader).split(" ")[1];
    jwt.verify(token, serect);
  } catch (error) {
    res.status(401).send({ message: `${error}` });
  }
  try {
    const users = await userStore.index();
    res
      .status(200)
      .json({ message: "Get list of users successfully", data: users });
  } catch (error) {
    res.status(500).send({ message: `${error}` });
  }
});
// get info just one user
userRoute.get("/:id", auth, async (_req: Request, res: Response) => {
  try {
    const userId = parseInt(_req.params.id);
    //@ts-ignores
    if (userId && typeof userId == "number") {
      const user = await userStore.showUserInfo(userId);
      res
        .status(200)
        .json({ message: "Get user info successfully", data: user });
      return user;
    } else {
      res
        .status(400)
        .send({ message: "Invalid userId or user id must be a number" });
    }
  } catch (error) {
    res.status(500).send({ message: `${error}` });
  }
});
// sign up
userRoute.post("/signUp", async (req: Request, res: Response) => {
  try {
    const newUser: User = {
      fistName: req.body.first_name,
      lastName: req.body.last_name,
      userName: req.body.userName,
      password: req.body.password,
    };
    if (
      newUser.userName &&
      newUser.password &&
      newUser.fistName &&
      newUser.lastName
    ) {
      const signUpUser = await userStore.createUser(newUser);
      res.status(200).json({
        message: "Sign up successfully",
        token: signUpUser,
      });
    } else {
      res.status(400).send({
        message: "Please input username, password, firstname, lastname",
      });
    }
  } catch (error) {
    res.status(422).json({
      message: `${error}`,
      data: null,
    });
  }
});
//create new user with Admin account
userRoute.post("/", auth, async (req: Request, res: Response) => {
  const newUser: User = {
    fistName: req.body.first_name,
    lastName: req.body.last_name,
    userName: req.body.userName,
    password: req.body.password,
  };
  try {
    if (
      newUser.userName &&
      newUser.password &&
      newUser.fistName &&
      newUser.lastName
    ) {
      const createdUser = await userStore.createUser(newUser);
      res.status(200).json({
        message: "Create user successfully",
        data: createdUser,
      });
    } else {
      res.status(400).send({
        message: "Please input username, password, firstname, lastname",
      });
    }
  } catch (error) {
    res.status(422).json({
      message: `${error}`,
      data: null,
    });
  }
});
// authenticate to get token (login)
userRoute.post("/authenticate", async (req: Request, res: Response) => {
  try {
    const userName = req.body.userName;
    const password = req.body.password;
    if (userName && password) {
      const authenUser = await userStore.authenticate(userName, password);
      res.status(200).json({
        message: "Login Successfully",
        token: authenUser,
      });
    } else {
      res
        .status(400)
        .send({ message: "Please input username, password to login" });
    }
  } catch (error) {
    res.status(403).json({
      message: `${error}`,
      data: null,
    });
  }
});

export default userRoute;
