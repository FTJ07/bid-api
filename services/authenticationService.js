const uuidv1 = require('uuid/v1');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticationDb = require('../db/authenticationDb');
const UserModel = require('../models/userModel');


exports.signupService = async(req)=>{
    let responseModel = {
        status:500,
        responseMessage:'Something went wrong with Database'
    };

    let userModel = new UserModel();
    userModel.Name = req.body.name;
    userModel.UserName = req.body.userName;
    userModel.UserPassword = req.body.userPassword;
    userModel.UserType = req.body.userType;
    
    //Check user exist
    const existUser = await authenticationDb.checkUserExist(userModel);
    if (existUser[0].length > 0) {
            responseModel.status = 422;
            responseModel.responseMessage = "Username already exist";      
    }else{
        
    //Register user
        userModel.ID = uuidv1(); 
        userModel.UserPassword = await hashingPassword(userModel);
        const [registerUser] = await authenticationDb.signupDb(userModel);
        if(registerUser.affectedRows === 1){
            responseModel.status = 200,
            responseModel.responseMessage = "Registration successful";
        }
    }

    return responseModel;

}


exports.signinService =async (req)=>{
    let responseModel = {
        status:500,
        responseMessage:'Something went wrong with Database'
    };

    let userModel = new UserModel();
    userModel.UserName = req.body.userName;
    userModel.UserPassword = req.body.userPassword;
    userModel.UserType = req.body.userType;
    const existUser = await authenticationDb.checkUserExist(userModel);
    if (existUser[0].length == 0) {
        responseModel.status = 401;
        responseModel.responseMessage = { auth: false, message: 'Username doesnt exist' };
    }else{
        const [user] = existUser[0];
        const matchedPassword = await comparePassword(userModel.UserPassword, user.userpassword);
        if(matchedPassword){
           const token = generateToken(user);
           responseModel.status = 200;
           responseModel.responseMessage = {auth:true,token:token};
        }else{
            responseModel.status = 401;
            responseModel.responseMessage = {auth: false, message: 'Password doesnt match'} ;
        }
    }
    return responseModel;
}


const hashingPassword = async (userModel)=>{
    const generatedSalt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
    const hashedPassword = await bcrypt.hash(userModel.UserPassword.toString(),generatedSalt);
    return hashedPassword;
}

const comparePassword = async (plainPassword, hashedPassword)=>{
     return await bcrypt.compare(plainPassword, hashedPassword);
}

const generateToken = (user)=>{
    return jwt.sign({ id: user.userId, name:user.username}, process.env.SECRET , {
        expiresIn: 60*60 // expires in 24 hours
      });
}