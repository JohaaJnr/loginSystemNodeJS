var mongoose = require('mongoose')

var dbconnect = async() =>{
    try{
        var connection = await mongoose.connect(process.env.MONGO_URI)
        if(connection){
            console.log(`Mongodb connected successfully on: ${connection.connection.host}`)
        }
    }catch(error){
        console.error(error)
    }
}

module.exports = dbconnect