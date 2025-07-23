const mongoose = require('mongoose');

const menuitemsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
})

module.exports = mongoose.model('Menuitems', menuitemsSchema);