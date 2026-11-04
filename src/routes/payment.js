const express = require('express');
const { userAuthMiddleWare } = require('../Middlewares/auth');
const razorpayInstance = require('../utils/razorpay');
const paymentRouter = express.Router();
const Payment = require('../models/payment');
const User = require('../models/user');
const { membershipAmount } = require('../utils/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils')
paymentRouter.post("/payment/create", userAuthMiddleWare, async (req, res) => {
    
    try{

        const { membershipType } = req.body;
        const {firstName, lastName, emailId} = req.user;

        const order = await razorpayInstance.orders.create({
            amount : membershipAmount[membershipType] * 100,
            currency : "INR",
            receipt : "receipt#1",
            notes : {
                firstName,
                lastName,
                emailId,
                membershipType : membershipType,
            },
        });
        console.log(order);
         //save it in my database
         const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
         });

         const savedPayment = await payment.save();

        //return back my order details to frontend
            res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    }catch(err) {
        console.log(err);
    }
})

paymentRouter.post("/payment/webhook", async (req, res) => {
    try{
        const webhookSignature = req.get("X-Razorpay-Signature");
        console.log(webhookSignature);
        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), 
        webhookSignature,
        process.env.RAZORPAY_WEBHOOK_SECRET);

        if(!isWebhookValid){
            return res.status(400).json({msg: "webhook signature is invalid"});
        }

        //update my payment status in DB
        const paymentDetails = req.body.payload.payment.entity;
        console.log(paymentDetails);
        const payment = await Payment.findOne({orderId: paymentDetails.order_id});
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findOne({_id: payment.userId});
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        //update the user as premium

        // if(req.body.event == "payment.captured"){

        // }
        // if(req.body.event == "payment.failed"){

        // }
        //return success response to razorpay
        res.status(200).json({ msg: "webhook received successfully"});
    }catch(err){
        console.log(err);
    }
})

paymentRouter.get('/premium/verify', userAuthMiddleWare, async (req, res) => {
    const user = req.user.toJSON();

    if(user.isPremium) {
        return res.json({ ...user });
    }
    return res.json({ ...user });
})
module.exports = paymentRouter;