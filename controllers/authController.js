const User = require('../models/User');
const jwt = require('jsonwebtoken');
function handleErrors(err){
    let errors = {email:'', password:''};
    //email is taken
    if(err.code === 11000){
        errors.email = 'this email is already registered';
        return errors;
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            console.log(properties);
            errors[properties.path] = properties.message
        })
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
function createToken(id){
    return jwt.sign({id} , 'my secret',{
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req,res)=>{
    res.render('signup');
}

module.exports.signup_post = async (req,res)=>{
    const {email, password} = req.body;
    console.log();
    try{
        const newuser = await User.create({email, password});
        const token = createToken(newuser._id);
        res.cookie('jwt', token ,{httpOnly:true, maxAge: maxAge*1000});
        res.status(201).json({user:newuser._id});
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

module.exports.login_get = (req,res)=>{
    res.render('login');
}

module.exports.login_post = (req,res)=>{
    res.send('login up');
}