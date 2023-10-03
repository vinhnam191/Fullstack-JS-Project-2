import express from 'express';
const routers = express.Router();
import productRoute from '../routes/api/productRoute';
import userRoute from './api/userRoute';
import orderRoute from './api/orderRoute';

routers.get('/', (req, res) => {
  res.send('Welcome to Project 2 of Udacity');
});

routers.use('/products', productRoute);
routers.use('/users', userRoute);
routers.use('/orders', orderRoute);

export default routers;
