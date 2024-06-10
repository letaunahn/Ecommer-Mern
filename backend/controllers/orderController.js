import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const newOrder = async (req, res) => {
  try {
    const order = new orderModel({
        shippingInfo: req.body.shippingInfo,
        orderItems: req.body.orderItems,
        paymentInfo: req.body.paymentInfo,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        user: req.user.id,
        paidAt: Date.now()
    })
    await order.save({ValidateBeforeSave: false})
    res.json({
        success: true,
        order
    })
  } catch (error) {
    console.log(error)
    res.json({
        success: false,
        message: `${error}`
    })
  }
};

export const getSingleOrder = async (req, res) => {
    const order = await orderModel.findById(req.params.id).populate(
        "user",
        "name email"
    )
    res.json({
        success: true, 
        order
    })
}

//get-all-orders-admin
export const getAllOrders = async (req, res) => {
    const orders = await orderModel.find()
    let totalAmount = 0
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}

export const updateOrder = async (req, res) => {
    const order = await orderModel.findById(req.params.id)
    if(order.orderStatus === 'Delivered'){
        return res.json({
            success: false,
            message: 'You have already delivered this order'
        })
    }
    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity)
        })
    }
    order.orderStatus = req.body.status
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now()
    }
    await order.save({validateBeforeSave: false})
    res.json({
        success: true
    })
}

async function updateStock(id, quantity){
    const product = await productModel.findById(id)
    product.Stock -= quantity
    await product.save({validateBeforeSave: false})
}

export const myOrders = async (req, res) => {
    const orders = await orderModel.find({user: req.user._id})
    res.status(200).json({
        success: true,
        orders
    })
}

export const deleteOrder = async (req, res) => {
    try {
        await orderModel.findByIdAndDelete(req.params.id)
        res.json({
            success: true
        })
    } catch (error) {
        console.log(error)
        res.josn({
            success: false,
            message: `${error}`
        })
    }
}