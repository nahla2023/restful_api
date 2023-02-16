const express = require('express'); 
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
       cb(null, './uploads/'); //cb is call back function
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname); 
    }
})
const filefilter = (req,file,cb) =>{
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
         cb(null, true);
    }
    else{
         cb(null,false);
    }
}
const upload = multer({
    storage: storage, 
    limits:{
    fileSize: 1024 * 1024 *5
    },
    fileFilter: filefilter

}); //uploads is a folder where multer store all images

const Product = require('../models/product')

router.get('/', ProductsController.get_all_products); //not /products since if we did like that it will be /products/products

router.post('/', checkAuth, upload.single('productImage'), ProductsController.add_product); //the post func can hold multiple handlers 'upload is a handler'
 
router.get('/:productId', ProductsController.get_product_byId);

router.patch('/:productId', checkAuth, ProductsController.update_product);

router.delete('/:productId', checkAuth, ProductsController.delete_product);

module.exports = router;