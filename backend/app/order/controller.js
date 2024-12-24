const Order = require('./model');
const OrderItem = require('../orderItem/model');
const CartItem = require('../cartItem/model');
const DeliveryAddress = require('../deliveryAddress/model');

const store = async (req, res, next) => {
    try {
        const { delivery_address, metode_payment, delivery_fee = 0, customer_name } = req.body;
        if (!metode_payment) {
            return res.json({
                error: 1,
                message: 'Payment method is required'
            });
        }

        const cart = await CartItem.find({ user: req.user._id }).populate('product');
        if (!cart || cart.length === 0) {
            return res.json({
                error: 1,
                message: 'Cart is empty'
            });
        }

        let orderData = {
            delivery_fee,
            metode_payment,
            customer_name,
            user: req.user._id,
            status: 'waiting payment'
        };

        // If delivery address is provided, add delivery address details
        if (delivery_address) {
            const address = await DeliveryAddress.findById(delivery_address);
            if (!address) {
                return res.json({
                    error: 1,
                    message: 'Delivery address not found'
                });
            }
            orderData.delivery_address = {
                kelurahan: address.kelurahan,
                kecamatan: address.kecamatan,
                kabupaten: address.kabupaten,
                provinsi: address.provinsi,
                detail: address.detail
            };
        }

        // Create order
        const order = new Order(orderData);

        // Create order items
        const orderItems = await OrderItem.insertMany(
            cart.map(item => ({
                name: item.product.name,
                price: item.product.price,
                qty: item.qty,
                product: item.product._id,
                order: order._id
            }))
        );

        // Add order items to order
        order.orderItems = orderItems.map(item => item._id);
        await order.save();

        // Clear cart
        await CartItem.deleteMany({ user: req.user._id });

        // Return populated order
        const populatedOrder = await Order.findById(order._id)
            .populate('orderItems')
            .populate('user', 'full_name');

        return res.json(populatedOrder);
    } catch (error) {
        console.error('Error in store:', error);
        if (error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
}

const index = async (req, res, next) => {
    try {
        const { limit = 10, skip = 0 } = req.query;
        const count = await Order.find({ user: req.user._id }).countDocuments();
        const orders = await Order.find({ user: req.user._id })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .populate('orderItems')
            .sort({ createdAt: -1 });
        return res.json({
            data: orders,
            count,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOneAndUpdate({ _id: id }, { $set: { status: 'paid' } }, { new: true });
        return res.json(order);
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
}

const show = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ _id: id })
            .populate('orderItems')
            .populate('user', 'full_name');

        if (!order) {
            return res.json({
                error: 1,
                message: 'Order not found'
            });
        }

        return res.json(order);
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        next(error);
    }
};

module.exports = {
    store,
    index,
    update,
    show
}