const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const empSchema = new mongoose.Schema({

    firstName: String,
    lastName: String,
    email:{
        type:String,
    },
    file:{
        type:String,
    },    
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'         
    }
},
{timestamps:true})

const emp = mongoose.model("employee",empSchema);
module.exports = emp;