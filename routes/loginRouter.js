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
    res.render('login', { csrfToken: req.csrfToken() })
})


Router.post('/auth', parseForm, csrfProtect,

body('username').notEmpty().trim().escape(),
body('password').notEmpty().trim().escape(),

(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var err = errors.array()
       return res.status(403).json({ msg: err })
       
    }

    User.findOne({$or:[{ username: req.body.username },{ email: req.body.username }]}).then(user=>{
        if(!user){
          return Promise.reject('User not found')
        }else{
          var key = req.body.password
          var dbkey = user.key
          bcrypt.compare(key, dbkey).then(result=>{
            if(result){
            var token = jwt.sign({ user }, 'secretNinja')
             req.session.user = token
             
             var remember = req.body.remember
             if(remember == 'on'){
              res.cookie('info', token)
             }
             
              res.redirect('/')
            }else{
              return Promise.reject('Username and password do not match. Try again')
            }
          }).catch(err => {
            res.send(err)
          })
        }
      }).catch(err => {
       
        res.send(err)
      })
})

module.exports = Router