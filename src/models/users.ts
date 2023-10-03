import client from '../connection'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const pepper = process.env.BCRYPT_PASSWORD;
const saltRound = Number(process.env.SALT_ROUND)
const secret = String(process.env.SECRET_TOKEN);
export type User = {
    id?: Number,
    fistName: string,
    lastName: string,
    userName: string,
    password: string
}

export class UserStore {
    // @ts-ignore
    async index(): Promise<User[]> {
        const connection = await client.connect();
        const sql = `SELECT * FROM users`
        const result = await connection.query(sql);
        if (result && result.rows) {
            connection.release();
            return result.rows;
        }
        else {
            connection.release();
            throw new Error(`Data Not Found`)
        }
    }
    // @ts-ignore
    async showUserInfo(user_id): Promise<Product> {
        const connection = await client.connect();
        const sql = `SELECT * FROM users WHERE id = ${user_id}`
        const result = await connection.query(sql);
        if (result.rows && result.rows.length > 0) {
            const token = jwt.sign({ userName: result.rows[0].user_name, id: result.rows[0].id }, secret)
            const data = {
                data: result.rows[0],
                token: token
            }
            connection.release();
            return data;
        } else {
            connection.release();
            throw new Error(`Data Not Found`)
        }
    }

    async createUser(user: User): Promise<User> {
        //@ts-ignore
        const connection = await client.connect();
        const sql_checkExist = `SELECT EXISTS (SELECT 1 FROM users WHERE user_name = '${user.userName}' limit 1)`
        const existedUser = await connection.query(sql_checkExist)
        if (existedUser.rows[0] && existedUser.rows[0].exists) {
            connection.release();
            throw new Error(" User name is already exist");

        } else {
            const sql_insert = `INSERT INTO users (first_name,last_name,user_name,password) VALUES ($1,$2,$3,$4) RETURNING *`
            const hash = bcrypt.hashSync(
                user.password + pepper,
                saltRound
            );
            const result = await connection.query(sql_insert, [user.fistName, user.lastName, user.userName, hash])
            const createdUser = result.rows[0]
            const token = jwt.sign({ userName: createdUser.user_name, id: createdUser.id }, secret)
            const data = {
                data: result.rows[0],
                token: token
            }
            connection.release()
            //@ts-ignore
            return data
        }
    }
    async authenticate(userName: string, password: string): Promise<User> {
        try {
            const connection = await client.connect();
            const sql = `SELECT password FROM users WHERE user_name=($1)`
            const result = await connection.query(sql, [userName])
            if (result.rows.length && result.rows.length > 0) {
                const user = result.rows[0];
                if (bcrypt.compareSync(password + pepper, user.password)) {
                    const token = jwt.sign({ userName: user.user_name, id: user.id }, secret)
                    connection.release();
                    //@ts-ignore
                    return token
                } else {
                    connection.release();
                    throw new Error("Invalid username or password. Please try again")
                }
            }
            connection.release()
            //@ts-ignore
            return null
        } catch (error) {
            throw new Error(`${error}`)
        }

    }
}