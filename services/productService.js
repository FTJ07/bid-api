const formidable = require('formidable');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const ProductModel = require('../models/productModel');
const productDb = require('../db/productDb');
const ProductBidModel = require('../models/productBidModel');
let IO;
exports.insertProductService = (req,res)=>{
    let productModel = new ProductModel();
    var form = new formidable.IncomingForm();
   
    form.parse(req,function(err,fields,files){
        productModel.ProductName = fields.productName;
        productModel.ProductDescription = fields.productDescription;
        productModel.ProductPrice = fields.productPrice;
    });
   
    form.on('fileBegin', function (name, file,err){
        const randomNumber = uuidv1();
        fs.mkdirSync("public/images/"+randomNumber);
        productModel.ProductImage = randomNumber + "/" +file.name;
        file.path = "public/images/" +  productModel.ProductImage;
    });

   
    return new Promise(function(resolve, reject) {
        form.on('end', async function() {
            const result = await productDb.insertProductDb(productModel);    
            if(result.length >0){
                resolve()
            }else{
                reject()
            }
       
        });
      });


}

exports.getProductListService = async ()=>{
        let responseModel = {
            status:500,
            data:null
        };

        return new Promise(async function(resolve, reject) {
                const result = await productDb.getProductListDb();    
                console.log(result.length);
                if(result.length >0){
                    resolve({status:200,data:result[0]})
                }else{
                    reject(responseModel)
                }
           
          });

}

exports.getProductBiddingListService = async ()=>{
    let responseModel = {
        status:500,
        data:null
    };
    return new Promise(async function(resolve, reject) {
       
        const productList= await getCalculatedProductBiddingList();
        if(productList.length >0){
            resolve({status:200,data:productList})
        }else{
            reject(responseModel)
        }
   
  });
}

exports.liveProductForBiddingService = (req,res)=>{

        let productModel = new ProductModel();
        productModel.ProductId = parseInt(req.body.productId);
        productModel.ProductIncrementalAmount = parseInt(req.body.productIncrementalAmount);
        productModel.ProductBiddingTime = parseInt(req.body.productBiddingTime);
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes()+ productModel.ProductBiddingTime);
        productModel.ProductBidEndingTime =  currentDate;
        productModel.ProductIsActive = Boolean(req.body.productIsActive)===true?1:0; 

        return new Promise(async function (resolve, reject) {
            const result = await productDb.liveProductForBiddingDb(productModel);
            if (result.length > 0) {
                resolve()
                biddingListHandler("From service")
               
            } else {
                reject()
            }


        });

}

exports.getProductBiddingListForSocketService  = (msg)=>{
   biddingListHandler(msg);
}

const biddingListHandler = async(msg)=>{
    const productList = await getCalculatedProductBiddingList();
    IO.emit("realTimeProductBiddingList", {data:productList,msg});
}

const getCalculatedProductBiddingList =async ()=>{
    const result = await productDb.getProductBiddingListDB(); 
    
    const productList = [];
    result[0].map((item)=>{
       
        let productBidModel = new ProductBidModel();
        const bidEndDate = new Date(item.productBidEndingTime);
        const currentDate = new Date();
        const diff = bidEndDate - currentDate;

        
        productBidModel.productId = item.productId;
        productBidModel.productName = item.productName;
        productBidModel.productDescription = item.productDescription;
        productBidModel.productPrice = item.productPrice;
        productBidModel.productImage = item.productImage;
        productBidModel.productIsActive = item.productIsActive;
        productBidModel.productBidRemainingTime = diff;
        productBidModel.productBiddingAmount = item.biddingAmount;
        productBidModel.userName = item.username;

        productList.push(productBidModel);
    });


    return productList;
}
exports.setIo = function(io) {
    IO=io
    
};