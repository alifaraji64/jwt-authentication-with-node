const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'pleas enter a valid email']
    },
    password:{
        type:String,
        required:[true,'please enter a password'],
        minlength:[6,'your password is short']
    }
})

// userSchema.post('save',(doc,next)=>{
//     next();
// })

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
module.exports = mongoose.model('user',userSchema);