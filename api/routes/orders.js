const express = require('express'); //this how we import 

const router = express.Router();

//Handle incoming GET requests to /orders
router.get('/',(req,res,next)=>{
    res.status(200).json({ 
        message: 'Orders were fetched'
    });
});

router.post('/',(req,res,next)=>{
    const order={
        productId: res.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message:' Order was created',
        order: order
    });
});

router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:' Order details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:' Order deleted'
    });
});
module.exports = router;