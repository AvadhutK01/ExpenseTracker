const Razorpay = require("razorpay");
const OrderData = require("../Models/paymentModel");
const userDb = require("../Models/userModel");
const sequelize = require("../dbConnection");

// Initailizing Razorpay
const rzp = new Razorpay({
    key_id: process.env.RAZORPAYKEYID,
    key_secret: process.env.RAZORPAYSECRET
});

/**
 * Purchasing a premium subscription
 */
module.exports.purchasePremium = async (req, res) => {

    if (!req.user) {
        return res.status(400).json({ message: 'User not found' });
    }

    try {

        const result = await rzp.orders.create({
            amount: 2000,
            currency: 'INR'
        });

        const order = {
            orderid: result.id,
            status: 'PENDING',
            userDatumId: req.user.id
        };

        await runTransaction(async t => {

            const orderResponse = await OrderData.create(order, { transaction: t });

            if (!orderResponse) {
                throw new Error('Error creating order');
            }

            return res.status(201).json({
                order: result,
                key_id: rzp.key_id
            });

        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error!' });
    }

};


/**
 * Updating razorpay transaction status
 */
module.exports.updateTransaction = async (req, res) => {

    if (!req.body.order_id) {
        return res.status(400).json({ message: 'Order ID required' });
    }

    try {

        const order_id = req.body.order_id;

        await runTransaction(async t => {

            if (req.body.payment_id) {

                const payment_id = req.body.payment_id;

                const orderResponse = await OrderData.findOne({
                    where: { orderid: order_id },
                    transaction: t
                });

                await req.user.update({ isPremium: true }, { transaction: t });

                await orderResponse.update({
                    paymentid: payment_id,
                    status: 'SUCCESSFUL'
                }, { transaction: t });

                return res.status(202).json({
                    success: true,
                    message: 'TRANSACTION SUCCESSFUL'
                });

            } else {

                const orderResponse = await OrderData.findOne({ where: { orderid: order_id } }, { transaction: t });

                await orderResponse.update({ status: 'FAILED' }, { transaction: t });

                return res.status(401).json({
                    success: false,
                    message: 'TRANSACTION FAILED'
                });

            }

        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error!' });
    }

};


/**
 * Check if user has premium subscription
 */
module.exports.checkPremium = async (req, res) => {

    if (!req.user) {
        return res.status(400).json({ message: 'User not found' });
    }

    try {

        await runTransaction(async t => {

            const premiumUser = await userDb.findOne({
                where: {
                    id: req.user.id,
                    isPremium: true
                },
                transaction: t
            });

            if (premiumUser) {
                return res.json({ result: 'true' });
            } else {
                return res.json({ result: 'false' });
            }

        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error!' });
    }

};

// Helper method to run transaction
async function runTransaction(callback) {
    const t = await sequelize.transaction();
    await callback(t);
    await t.commit();
}