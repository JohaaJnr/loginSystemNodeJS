var express = require('express')
var Router = express.Router()
var { body, validationResult } = require('express-validator')
var bcrypt = require('bcrypt')
var csrf = require('csurf')
var bodyParser = require('body-parser')
var csrfProtect = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })
var jwt = require('jsonwebtoken')
var User = require('../model/User')



Router.get('/', csrfProtect, (req,res)=>{
 
    res.render('signup', { csrfToken: req.csrfToken() })
})



Router.post('/create_user', parseForm, csrfProtect, 

body('username').notEmpty().trim().escape().custom(value=>{
    return(
     User.findOne({ username: value }).then(user=>{
         if(user){
             return Promise.reject('Username already taken. Enter a new one')
         }
     })
    )
 }),


body('email').notEmpty().isEmail().custom(value=>{
    return(
     User.findOne({ email: value }).then(user=>{
         if(user){
             return Promise.reject('Email already taken. Enter a new one')
         }
     })
    )
 }),

body('dob').notEmpty().isDate(),

body('mobile').notEmpty().trim().escape().isLength({ min: 11, max: 12 }),

body('pass').notEmpty().trim().escape().isLength({ min: 5 }),

(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var err = errors.array()
       return res.status(403).json({ msg: err })
       
    }
   
    bcrypt.hash(req.body.pass, 10).then(hash=>{
        var newUser = {
            username: req.body.username,
            email: req.body.email,
            dob: req.body.dob,
            phone: req.body.mobile,
            key: hash
        }
        User.create(newUser)
        var token = jwt.sign({ user: newUser}, 'secretNinja')
        req.session.user = token
        
        res.redirect('/')
    }).catch(err=>{
        res.send(err)
    })
})




module.exports = Router