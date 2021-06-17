import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/ordermodels.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.post('/',isAuth,
    expressAsyncHandler(async (req, res) =>{
    if(req.body.orderItems.length === 0){
        res.status(400).send({
            message: 'Giỏ hàng trống'
        });
    }else{
        const order = new Order({
            orderItems: req.body.orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
            });
        const createdOrder = await order.save();
        res.status(201).send({
            message: 'Tạo đơn hàng mới', order: createdOrder
        });
        }
    })
);

orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) =>{
    const order = await Order.findById(req.params.id);
    if(order){
        res.send(order);
    }else{
        res.status(404).send({
            message: 'Không tìm thấy đơn hàng'
        })
    }
}))

export default orderRouter