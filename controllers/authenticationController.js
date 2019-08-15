const authenticationService = require('../services/authenticationService');

exports.signup = async (req,res,next)=>{
    const response = await authenticationService.signupService(req);
     res.status(response.status).send({message:response.responseMessage});
}



exports.signin = async (req,res,next)=>{
    const response = await authenticationService.signinService(req);
    res.status(response.status).send(response.responseMessage);
}