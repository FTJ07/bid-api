const BidModel = require('../models/bidModel');
const productDb = require('../db/productDb');
const bidDb = require('../db/biddingDb');

exports.insertBidService = async(req,res)=>{
    let responseModel = {
        status:500,
        data:"Something went wrong with server"
    };

    let bidModel = new BidModel();
    bidModel.BiddingProductId = parseInt(req.body.productId);
    bidModel.BiddingUserId = req.user.id;
    const productInfo = await productDb.productInfoDb(bidModel.BiddingProductId);
 

    return new Promise(async function (resolve, reject) {
        let productEntry = false;
        if (productInfo[0].length > 0) {
            let pInfo = productInfo[0][0];
    
            if( pInfo.biddingAmount!=null &&  pInfo.biddingAmount >0){
                pInfo.productPrice = parseInt(pInfo.biddingAmount);
            }
            bidModel.BidingAmount = pInfo.productIncrementalAmount === null ? 0 : parseInt(pInfo.productIncrementalAmount) +pInfo.productPrice;
            const bidEndDate = new Date(pInfo.productBidEndingTime);
            const currentDate = new Date();
            const diff = bidEndDate.getTime() - currentDate.getTime();

            if (diff > 0) {
       
                const result = await bidDb.insertBidDb(bidModel);
                responseModel.status = 200;
                responseModel.data = "Successfully inserted";
                if(result.length>0) productEntry = true
            } else {
                responseModel.data = "Product Bidding Time end";
            }
            } else {
                responseModel.data = "Product isn't available";
            }

            if (productEntry) {
                resolve(responseModel)
            } else {
                reject(responseModel)
            }


    });

}


