const mongoose = require('mongoose');
// const { required } = require('nodemon/lib/config');


const NewSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true  
    },
    lastname:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true,
        unique:true,
        min: 10,
        maxlength:10
    },
    
    // phone: {
    //     type: String,
    //     validate: {
    //       validator:(v)=> {
    //         return /\d{3}-\d{3}-\d{4}/.test(v);
    //       },
    //       message: props => `${props.value} is not a valid phone number!`
    //     },
    //     required: [true, 'User phone number required']
    //   },

    gender:{
        type: String,
        required: true,
        enum:['Male','Female']
    },
    email:{
        type: String,
        required: true,
        // unique:true
    },
    // date_of_birth:{
    //     type: Number,
    //     required: true,
    // },
    dateOfBirth: {
        type: Date,
        required: true,
        trim: true
    },
    referral_code:{
        type: false 
    },
    photo:{
        type:String,
        required: true
    },
    token:[{
        type: String,
    }]
    // social:{
    //     type: String,
    //     required:true
    // }
   
})

const Verma = mongoose.model('C_name', NewSchema)
module.exports = Verma;
