const express = require('express');
const app = express();
const userModel = require('./models/user');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


app.set('view engine' , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/' , (req , res) =>{
    res.render("index");
});

app.post('/register' ,async (req , res) =>{
    let {name , username , age , email , password} = req.body;
    let user = await userModel.findOne({email});
    if(user){return res.status(300).send("user already exists");}

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            await userModel.create({
                age,
                email,
                name, 
                username,
                password:hash
            });
        });

    });

    var token = jwt.sign({ email:email}, 'shhhhh');
     
    
    res.cookie("token" , token);
    res.redirect("/");
    
});

app.listen(3000);