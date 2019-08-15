const bidService = require('../services/bidService');

exports.insertBid = (req,res)=>{
    bidService.insertBidService(req)
    .then((response)=>{
        res.status(response.status).send({message:response.data})
    })
    .catch((error)=>{
        res.status(error.status).send({message:error.data})
    });
}