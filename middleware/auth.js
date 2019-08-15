const jwt = require('jsonwebtoken');
module.exports = (req, res, next)=>{
    const token = req.header('x-auth-token');

    if(!token) return res.status(400).send("Access denied. No token Provided")
    try{
        const decoded = jwt.verify(token,process.env.SECRET);
        req.user = decoded;
        next();
    }catch(ex){
        res.status(400).send("Invalid Token")
    }

}