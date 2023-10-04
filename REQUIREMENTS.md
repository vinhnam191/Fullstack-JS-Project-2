# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index : `path : /products` , method : [GET], **list out all of the products are available in project**
- Show: `path: /product/:id` , method : [GET], **list out product by using product id**
- Create [token required] {
  `path: /products`
  method : [POST]
  require Token : true
  **create new product**
  }
- [OPTIONAL] Products by category (args: product category){
  `path : /products/category/:category`
  method: [GET]
  require token : false
  **Get list of products by input the category name**
  }

#### Users

- Index [token required] {
  `path : /users`
  method : [GET]
  require token : true
  **Get list of users in project**
  }
- SignUp {
  `path : /signUp`
  method: [POST]
  require Token : false
  **allow user to sign up and got the token , then user can use that token for project**
  }
- Show [token required] {
  `path: /users/:id`
  method : [GET]
  require token : true
  **Get user info with user id**
  }
- Create N[token required]{
  `path : /users`
  method: [POST]
  require Token : true
  **create new user in the project with token required**
  }
- Login {
  path :/authenticate
  method: [POST]
  require token : false
  **Allow user to login and then get the token**
  }

#### Orders

- Current Order by user (args: user id)[token required] {
  path : /orders/user/userId
  method : [GET]
  require token : true
  **allow user to get orders by user id**
  }
- [OPTIONAL] Completed Orders by user (args: user id)[token required] {
  path: /orders/user/:userId/order
  method :[GET]
  token require : true
  **Get completed orders by user using user id**
  }
- update Order status {
  path : /orders/:id
  method: [PUT],
  token require: false
  **update status of order from active to complete**
  }
- create Order {
  path : /orders
  method:[POST]
  token require : false
  **allow user to create order**
  }
- Get list of Orders {
  path : /orders
  method : [GET]
  token require : false
  **Get list of all orders**
  }

## Data Shapes

#### Product

- id SERIAL PRIMARY KEY (id of each product),
- name VARCHAR(40) (name of product)
- price integer (price of product)
- [OPTIONAL] category (product's category is optional)

#### User

- id SERIAL PRIMARY KEY (id of each user),
- firstName VARCHAR(50) (user's first name),
- lastName VARCHAR(50) (user's last name),
- user_name VARCHAR(50) UNIQUE (user's login name is unique),
- password TEXT (user's password)

#### Orders

- id SERIAL PRIMARY KEY (id of each order),
- product_id bigint (product's id in the order),
- quantity integer (quantity of each product in the order),
- user_id bigint (user_id of each order),
- status VARCHAR(10) (order's status)

#### Order Product

- order_id bigint (id of the order),
- product_id bigint (id of the product in the order),
- FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
- FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
- PRIMARY KEY (order_id, product_id)
