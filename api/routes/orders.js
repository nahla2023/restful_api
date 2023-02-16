const express = require('express'); 
const router = express.Router();
const checkAuth = require('../middleware/check-auth');//middlware

const OrdersController = require('../controllers/orders');

//Handle incoming GET requests to /orders
router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/',checkAuth, OrdersController.orders_create_order);
            
router.get("/:orderId",checkAuth, OrdersController.get_order_ById);
  
router.delete("/:orderId",checkAuth, OrdersController.delete_order);
  
module.exports = router;