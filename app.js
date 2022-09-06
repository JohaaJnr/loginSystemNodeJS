var express = require('express')
var dotenv = require('dotenv')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var path = require('path')
var cors = require('cors')
var flash = require('connect-flash')
var fileUpload = require('express-fileupload')
var IndexRouter = require('./routes/indexRouter')
var db = require('./config/db')
var app = express()


//config Server
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
dotenv.config({ path: './config/config.env'})
var Port = process.env.PORT || 5000
db();
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload())
app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
    
  }))
app.use(flash())

app.use(cors())




//defining routes
app.use('/', IndexRouter)


// custom 404
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})
  
  // custom error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(Port, (req,res)=>{
    console.log(`Application Started on Port: ${Port}`)
})