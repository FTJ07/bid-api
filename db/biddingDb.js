const pool = require('./connection');

exports.insertBidDb = (bidModel)=>{

    return pool.query(`
            INSERT INTO bidding(
                biddingProductId,
                biddingUserId,
                biddingAmount
            )VALUES(
                ${bidModel.BiddingProductId},
                '${bidModel.BiddingUserId}',
                ${bidModel.BidingAmount}
            )
    `).then()
    .catch((err)=>{
       
        return err;
    });
}
