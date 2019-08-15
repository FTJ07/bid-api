const express = require("express");
const authenticationController = require('../controllers/authenticationController');
const productController = require('../controllers/productController');
const bidController = require('../controllers/bidController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
//Routings


router.post('/createProduct',authMiddleware,productController.insertProduct);
router.post('/liveProductForBidding',authMiddleware,productController.liveProductForBidding);
router.get('/getProductList',productController.getProductList);
router.get('/getProductBiddingList',productController.getProductBiddingList);

router.post('/signup',authenticationController.signup);
router.post('/signin',authenticationController.signin);


router.post('/createBid',authMiddleware,bidController.insertBid);




module.exports = router;