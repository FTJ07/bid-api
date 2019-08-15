const pool = require('./connection');
exports.signupDb =  (userModel)=>{
    return pool.query(`INSERT INTO user
    (
        userId,
        name,
        username,
        userpassword,
        usertype
    )
    VALUES
    (
        '${userModel.ID}',
        '${userModel.Name}',
        '${userModel.UserName}',
        '${userModel.UserPassword}',
        ${userModel.UserType}
    )`)
    .then()
    .catch((err)=>{console.log(err)});
}

exports.checkUserExist =  (userModel)=>{
   return  pool.query(`Select * from user where
    username = '${userModel.UserName}' and
    usertype = ${userModel.UserType}`)
    .then()
    .catch((err)=>{console.log(err)});

}