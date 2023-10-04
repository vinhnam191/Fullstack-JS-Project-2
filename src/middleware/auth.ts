import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();
const secret = String(process.env.SECRET_TOKEN);

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, secret);
      next();
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    res.status(401).json({
      message: `Access denied! Invalid token`,
    });
  }
};
export default auth;
