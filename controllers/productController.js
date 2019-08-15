const productService = require('../services/productService');

exports.insertProduct = (req,res)=>{
     productService.insertProductService(req)
     .then(()=>{
         res.status(200).send({message:"Sucessfully inserted"})
     })
     .catch(()=>{
         res.status(500).send({message:"Something went wrong"})
     });
}

exports.getProductList = async (req,res)=>{
    productService.getProductListService()
    .then((response)=>{
        res.status(response.status).send({data:response.data})
    })
    .catch((err)=>{
        res.status(err.status).send({data:err.data})
    })
    
}


exports.getProductBiddingList = async (req,res)=>{
    productService.getProductBiddingListService()
    .then((response)=>{
        res.status(response.status).send({data:response.data})
    })
    .catch((err)=>{
        res.status(err.status).send({data:err.data})
    })
    
}

exports.liveProductForBidding = async (req,res)=>{
    productService.liveProductForBiddingService(req)
    .then((response)=>{
        res.status(200).send({message:"Sucessfully inserted"})
    })
    .catch((err)=>{
        res.status(500).send({message:"Insertion failed"})
    })
    
}