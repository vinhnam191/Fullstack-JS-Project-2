import client from '../connection'

export type Product = {
    id?: Number,
    name: string,
    price: Number,
    category?: string
}
export class ProductStore {
    // @ts-ignore
    async index(): Promise<Product[]> {
        const connection = await client.connect();
        const sql = `SELECT * FROM products`
        const result = await connection.query(sql);
        if (result && result.rows) {
            connection.release();
            return result.rows;
        } else {
            connection.release();
            throw new Error(`Data Not Found`)
        }

    }
    // @ts-ignore
    async showProductInfo(product_id): Promise<Product> {
        const connection = await client.connect();
        const sql = `SELECT * FROM products WHERE id = ${product_id}`
        const result = await connection.query(sql);
        if (result.rows && result.rows.length > 0) {
            connection.release();
            return result.rows[0];
        } else {
            connection.release();
            throw new Error(`Data Not Found`)
        }
    }
    // @ts-ignore
    async createProduct(p: Product): Promise<Product> {
        const newProduct: Product = {
            name: p.name,
            price: p.price,
            category: p.category
        }
        const connection = await client.connect();
        const sql = 'INSERT INTO products (name, price , category) VALUES ($1,$2,$3) RETURNING *'
        const result = await connection.query(sql, [newProduct.name, newProduct.price, newProduct.category])
        if (result && result.rows.length > 0) {
            const createdProduct = result.rows[0]
            connection.release()
            return createdProduct;
        } else {
            connection.release();
            throw new Error(`Error when insert data to db`)
        }
    }
    async getProductByCategory(category: string): Promise<Product[]> {
        const connection = await client.connect();
        const sql = `SELECT * FROM products WHERE category LIKE '%${category}%'`
        const result = await connection.query(sql);
        if (result && result.rows.length > 0) {
            const productByCategory = result.rows;
            return productByCategory;
        } else {
            connection.release();
            throw new Error(`Data Not Found`)
        }
    }
}