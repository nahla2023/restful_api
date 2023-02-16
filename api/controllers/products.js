const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_all_products = (req,res,next)=>{
    Product.find()
    .select("name price productImage _id")
    .exec()
    .then(docs => 
    {      const response = {
            count: docs.length,//avialable products
            products: docs.map(doc =>{
                return{
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: { //setting meta-data (we can set whatever info we need)
                        type:"GET",
                        description: "Get all products",
                        url:"http://localhost:3000/products/"+doc._id
                    }
                }
               })
    };  
    res.status(200).json(response);
    })
    .catch( err => {
         console.log(err);
         res.status(500).json({error:err});
    })

}

exports.add_product =(req,res,next)=>{ //the post func can hold multiple handlers 'upload is a handler'
   
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    
    product
        .save()
        .then(result=>{
           console.log(result);
           res.status(201).json({
              message: 'Created product successfully',
              createProduct: {
                name:result.name,
                price:result.price,
                _id:result._id,
                request: {
                    type:'GET',
                    Url:"http://localhost:3000/products/"+result._id
                }
              }

           })
        })
         .catch(err => 
           { 
            console.log(err)
            res.status(500).json({error:err})
        });

}

exports.get_product_byId = (req, res, next)=>{
    const id = req.params.productId; //get the id from the request
    /*if(id=== 'special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    }
    else{
        res.status(200).json({
            message:'You passed an ID'
        });
    }*/
    Product.findById(id)
    .select("name price productImage _id")
    .exec()
    .then(doc => {
         console.log("From database",doc);
         //Checking for doc if null
        if(doc){ 
           res.status(200).json({
            product:doc,
            request: {   
                type:'GET',
                Url:"http://localhost:3000/products/"
            }
           });
        }
        else{
            res.status(404).json({message:"No entry found for provided ID"});
        }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err})
    })

}

exports.update_product = (req, res, next)=>{
    const id = req.params.productId;
   /* const updateOps = {};
    for(const ops of req.body){
     updateOps[ops.propName] = ops.value;
    }
    
    Product.update({_id:id},{$set: updateOps})
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json(result);
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })*/
    Product.findByIdAndUpdate(id, { $set: req.body }, { new: true})
          .then(result => res.status(200).json({
            message: 'Product Updated.',
            name:result.name,
            price:result.price,
            request:{
                type:'GET',
                Url:"http://localhost:3000/products/"+ id
            }
          })
          )
          .catch(err => res.status(500).json({ error: err}))
}

exports.delete_product = (req, res, next)=>{
    const id = req.params.productId; 
    Product.remove({_id:id}).exec()
    .then(result => {
     res.status(200).json({
         message:"Product deleted",
         request:{
             type:"POST",//this is just to let the one using the api know that this url will send a post request with providing the body in the form provided
            url:"http://localhost:3000/products/",
             body: {name:"String",price:"Number"}
         }
     });
    }).catch( err =>
     {    console.log(err);  
          res.status(500).json({
             error:err
         });
     }
    )
 }