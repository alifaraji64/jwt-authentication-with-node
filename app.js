const express =  require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const requiresAuth = require('./middleware/authMiddleWare');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine','ejs');

const dbURI = "mongodb+srv://<name>:<password>@cluster0.ujzqw.mongodb.net/jwt-auth";
mongoose.connect(dbURI,{ useCreateIndex:true, useNewUrlParser:true, useUnifiedTopology:true })
.then(()=>{
    console.log('db connected');
})
.catch((e)=>{
    console.log(e);
})

app.get('/',(req,res) => res.render('home'));
app.get('/smoothies', requiresAuth, (req,res) => res.render('smoothies',{jwt:req.cookies.jwt}));
app.use(authRoutes);

app.listen(3000,()=>{
    console.log('app is running');
})