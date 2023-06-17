//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

console.log(process.env.API_KEY);

// Mongoose connection 
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

// Mongoose Schema
const UserSchema = new mongoose.Schema({
    email : String,
    password : String
});

// Encryptiom

UserSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

// Mongoose Model
const User = mongoose.model('User', UserSchema);

app.get("/", function(req,res) {
    res.render("home");
});

app.get("/login", function(req,res) {
    res.render("login");
});

app.get("/register", function(req,res) {
    res.render("register");
});

app.post("/register" , function(req,res) {
    var email = req.body.username;
    var password = req.body.password;

    const user = new User();
    user.email = email;
    user.password = password;
    user.save();
    res.redirect("/");

});

app.post("/login" , function(req,res) {
    var emailb = req.body.username;
    var passwordb = req.body.password;

    console.log(passwordb);
    async function find() {
        try {
          const doc = await User.find({email : emailb});

            if(doc[0].password === passwordb) {
                res.render("secrets");
            }
           else {
            res.render("register");
          }
        } finally {
          
        }
      }
    find().catch(console.dir);
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});