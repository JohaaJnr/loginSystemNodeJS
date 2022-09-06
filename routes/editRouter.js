var express = require('express')
var Router = express.Router()
var { body, validationResult } = require('express-validator')
var csrf = require('csurf')
var bodyParser = require('body-parser')
var csrfProtect = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })
var jwt = require('jsonwebtoken')
var User = require('../model/User')

Router.get('/user', checkAuth, csrfProtect, (req,res)=>{
    var sessionUser = req.user
    User.findOne({ _id: sessionUser.user._id }).then(user=>{
        res.render('edit', { userInfo: user, csrfToken: req.csrfToken() })
    }).catch(err=>{
        res.send(err)
    })

    
})


Router.post('/user/update', checkAuth, parseForm, csrfProtect,

body('username').notEmpty().trim().escape(),
body('email').notEmpty().isEmail(),
body('tel').notEmpty().trim().escape().isLength({ min: 11, max: 12 }),
body('url').notEmpty().trim().escape(),
body('profession').notEmpty().trim().escape(),
body('skills').notEmpty().trim().escape(),


(req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var err = errors.array()
       return res.status(403).json({ msg: err })
       
    }

    var usr = req.user
    User.findOneAndUpdate(usr.user._id, { username: req.body.username, email: req.body.email, link: req.body.url.trim().split(","), profession: req.body.profession, phone: req.body.tel, skills: req.body.skills.trim().split(",") }).then(user=>{
        if(user){
             res.redirect('/edit/user')
        }
    }).catch(err=>{
        console.log(err)
    })
 
})





function checkAuth(req,res,next){
    var accessToken = req.session.user
    if(accessToken){
       var usr = jwt.verify(accessToken, 'secretNinja')
       req.user = usr
        next()
    }else{
        res.redirect('/login')
    }
}

module.exports = Router