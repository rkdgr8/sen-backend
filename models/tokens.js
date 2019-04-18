
const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    _subscriberid:{
        type:String,
        required:true
    },
    _facultyid:{
        type:String,
        required:true
    },
    token:{
        type: String,
        required: true
    }

})

module.exports = mongoose.model( "Token" , tokenSchema)