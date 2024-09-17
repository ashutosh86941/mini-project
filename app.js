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

app.get('/login' , (req , res) => {
    res.render("login")
});

app.post('/login' ,async (req, res) => {
    let {email , password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("wrong something is");

    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            var token = jwt.sign({ email:email}, 'shhhhh');
            res.cookie("token" , token);
            res.status(200).send("yes u can login");
        }else{ 
            res.redirect("/login");
        }
    });
    
})

app.get('/logout' , (req , res) => {
    res.cookie("token" , "");
    res.redirect("/login");
});

function isLoggedin(req, res, next){

    if(req.cookies.token === "") {return res.send("you must be logged in first");}
    else {
        var data = jwt.verify(req.cookies.token, 'shhhhh');
        req.user = data;
        next();
    }
    
}

app.get('/profile' , isLoggedin , (req, res) => {
    res.send(`hello, ${req.user.email}`);
})

app.listen(3000);