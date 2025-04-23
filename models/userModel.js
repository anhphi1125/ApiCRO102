const mongoose = require('mongoose');
const Schema = mongoose.Schema;//schema == collection
const ObjectId = Schema.ObjectId;
const user = new Schema({
    id: {type: ObjectId},
    name: {type: String},
    email: {
        type : String,
        unique: true
    },
    password: {
        type: String,
        minlength: 6
    },
    phone: {
        type: String,
        unique: true
    },
    img: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/024/983/914/original/simple-user-default-icon-free-png.png"
    },
    address: {
        type: String,
        default: ""
    }
});
module.exports = mongoose.models.user || mongoose.model('user', user);