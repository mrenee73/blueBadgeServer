const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const {UserModel} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/*
===============
REGISTER USER
===============
*/
router.post('/register', async (req, res) => {
    let { email, password, firstName, lastName, street} = req.body.user;     
    try{
        const User = await UserModel.create({
        email,
        password: bcrypt.hashSync(password, 13),
        firstName,
        lastName,
        street,
        admin: false
    });

    let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60* 24});

    res.status(201).json({
        message: 'This is our user/register is successfully registered',
        user: User,
        sessionToken: token
    });
} catch (err) {
    if (err instanceof UniqueConstraintError){
        res.status(409).json({
            message: "email already in use",
        });
    } else {
    res.status(500).json({
        message: "failed to register user",
    });
}
}
});


/*
===========
LOGIN USER
===========
*/

router.post("/login", async (req, res) => {
    let { email, password} = req.body.user;

    try{
        let loginUser=  await UserModel.findOne({
        where: {
            email: email,
        },          
    });

    if (loginUser){

        let passwordComparison = await bcrypt.compare(password, loginUser.password);
        if (passwordComparison){
        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60* 24});
    res.status(200).json({
        user: loginUser,
        message: "User successfully logged in!",
        sessionToken: token
    });
    }else {        
    res.status(401).json({
    message: "Incorrect email or password"
})
}

}else {        
    res.status(401).json({
    message: "Incorrect email or password"
});
}
}catch (error) {
    res.status(500).json({
        message: "failed to log user in"
    })
}
});

/**
==============
GET ALL USERS
==============
 */




/**
==============
DELETE A USER
==============
 */

module.exports = router;