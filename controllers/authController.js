const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

const maxAge = 60 * 60 * 24 * 3;
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
    try{
        const newuser = await User.create({email, password});
        const token = createToken(newuser._id);
        res.cookie('jwt', token ,{httpOnly:true, maxAge: maxAge*1000});
        res.status(201).json({user:newuser._id,token});
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

module.exports.login_get = (req,res)=>{
    res.render('login',{jwt:req.cookies.jwt});
}

module.exports.login_post = async (req,res)=>{
    const { email, password} = req.body;
    let errors = {email:'',password:''};
    try{
        let resp = await User.find({email});
        //email is not registered
        if(!resp.length){
            errors['email'] = 'register your email and try again'
            return res.status(200).json({errors})
        }
        //email is registered
        else{
            //compare passwords
            bcrypt.compare(password, resp[0].password, function(err, result) {
                //password is correct and we can register
                if(result){
                    let token = createToken(resp[0]._id);
                    res.cookie('jwt', token ,{httpOnly:true, maxAge: maxAge*1000});
                    return res.status(200).json({token});
                }
                else{
                    errors['password'] = 'password in incorrect';
                    return res.status(200).json({errors})
                }
            });
        }
    }
    catch(e){
        console.log(e);
    }
}