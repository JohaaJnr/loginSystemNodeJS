var express = require('express')
var Router = express.Router()
var LoginRouter = require('./loginRouter')
var RegisterRouter = require('./registerRouter')
var EditRouter = require('./editRouter')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var User = require('../model/User')
var csrf = require('csurf')
var csrfProtect = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })
var { dirname } = require('path')
var fs = require('fs')

Router.get('/', checkAuth, csrfProtect, (req,res)=>{
    var loggedUser = req.user
   User.findOne({ _id: loggedUser.user._id }).then(user=>{
    res.render('home', { userInfo: user, csrfToken: req.csrfToken() })
   })
    
})

Router.post('/upload', checkAuth, parseForm, csrfProtect, async(req,res)=>{
    var image = req.files.img
    var loggedUser = req.user

   await User.findOne({ _id: loggedUser.user._id }).then(user=>{
        if(user){
            var fileName = user.image
            var filePath = dirname(require.main.filename) + '/public/' + fileName
            fs.unlinkSync(filePath)
        }
    }).catch(err=>{
        res.send(err)
    })

    const uploadPath = dirname(require.main.filename) + '/public/images/' + image.name

  await image.mv(uploadPath, function(err){
    if(err){
        res.send(err)
    }
    User.findOneAndUpdate(loggedUser.user._id, { image: "/images/"+ image.name }).then(user=>{
        if(user){
            res.redirect('/')
        }
    }).catch(err=>{
        res.send(err)
    })
   })

    
})

Router.use('/login', LoginRouter)
Router.use('/register', RegisterRouter)
Router.use('/edit', EditRouter)

Router.get('/logout', (req,res)=>{
    req.session.destroy()
    res.redirect('/')
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