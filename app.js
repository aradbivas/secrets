//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypted = require("mongoose-encryption");
const app = express();
mongoose.connect("mongodb+srv://Arad:250295Bivas@cluster0.rfa43.mongodb.net/secretsDB");

const userSchema =  new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(encrypted, {secret:process.env.SECRET , encryptedFields: ["password"]});
const User = mongoose.model("User", userSchema);
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function (req,res){
    res.render("home");
});
app.get("/login", function (req,res){
    res.render("login");
});
app.get("/register", function (req,res){
    res.render("register");
});
app.post("/register", function (req,res){
    const username = req.body.username;
    const password = req.body.password;
    const user = new User( {
        email:username,
        password:password
    });
    user.save(function (err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("secrets");
        }
    });
});
app.post("/login",function (req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function (err, foundUser){
        if(err)
        {
            console.log(err);
        }
        else if(foundUser)
        {
            if(foundUser.password === password)
            {
                res.render("secrets");
            }
        }
    });
});
app.listen(process.env.PORT || 3000, function (){
    console.log("server is running!");
});

