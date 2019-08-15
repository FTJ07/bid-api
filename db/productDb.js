const pool = require('./connection');

exports.insertProductDb = (productModel)=>{

    return pool.query(`
            INSERT INTO product(
                productName,
                productDescription,
                productPrice,
                productImage
            )VALUES(
                '${productModel.ProductName}',
                '${productModel.ProductDescription}',
                '${productModel.ProductPrice}',
                '${productModel.ProductImage}'
            )
    `).then()
    .catch((err)=>{
        console.log(err)
        return err;
    });
}


exports.getProductBiddingListDB = ()=>{
    return pool.query(`
            select 
            *
            FRom  auctions.product p 
            LEFT JOIN ( 
                select b.biddingProductId, MAX(b.biddingAmount) as biddingAmount , b.biddingUserId
                from  auctions.bidding b 
                GROUP BY b.biddingProductId
                )
                    as biddingTable 
            ON p.productId = biddingTable.biddingProductId 
            LEFT JOIN auctions.user u
            on biddingTable.biddingUserId = u.userId

    `)
    .then()
    .catch((err)=>err);
}


exports.getProductListDb = ()=>{
    return pool.query('Select * from product')
    .then()
    .catch((err)=>err);
}



exports.liveProductForBiddingDb = (productModel)=>{
    return pool.query(`
           UPDATE product
           SET 
           productIncrementalAmount = ${productModel.ProductIncrementalAmount}
           ,productBidEndingTime = '${productModel.ProductBidEndingTime}'
           , productBiddingTime = '${productModel.ProductBiddingTime}'
           ,productIsActive = '${productModel.ProductIsActive}'
           where productId = ${productModel.ProductId}
    `).then()
    .catch((err)=>{
        console.log(err);
        return err;
    });
}

exports.productLastBiddingPriceDb = (productId)=>{
    return pool.query( `
            Select MAX(biddingAmount) from auctions.bidding 
            where biddingProductId = ${productId}
    `)
    .then()
    .catch((err)=>err);
}


exports.productInfoDb = (productId)=>{
    return pool.query( `
    SELECT *
    FROM 
    auctions.product p
    LEFT JOIN   (
    Select biddingProductId, MAX(biddingAmount) biddingAmount
    from
    auctions.bidding b 
    Where b.biddingProductId = ${productId}
    ) as filterTable
    ON p.productId = filterTable.biddingProductId 
    
   Where p.productId =   ${productId}
    `)
    .then()
    .catch((err)=>{ return err});
}
