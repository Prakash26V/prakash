const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
        title:{
            type: String,
        },
        type:{
            type: String,
            enum: ['web','app'],
        },
        priority:{
            type: String,
            enum: ['top','mid-top','buttom-top','buttom'],  
        },
        photo:{
            type: String,
        }
})

const picture = mongoose.model('banner', inventorySchema);
module.exports = picture;