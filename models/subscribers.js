const mongoose = require('mongoose')

const subscribersSchema = new mongoose.Schema(
    {
        email : {
            type: String,
            required: true
        },
        fac: {
            type: String,
            required: true
        },
        isVerified:{
            type:Boolean,
            default:false
        }

    }
)

module.exports = mongoose.model("Subscriber", subscribersSchema)