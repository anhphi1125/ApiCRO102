const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const product = new Schema({
    id: {type: ObjectId},
    name: {type: String},
    price: {type: Number},
    quantity: {type: Number},
    attribute: {type: String},
    image: {type: String},
    origin: {type: String},
    size: {type: String},
    type: { type: String}
});
module.exports = mongoose.models.product || mongoose.model('product', product);