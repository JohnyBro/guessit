const mongoose = require('mongoose')
const { Schema } = mongoose

const imageSchema = new Schema({
    name:  {type: String, required: true},
    pixelImages: {type: [String], required: true},
    approved: {type: Boolean, required: true}
})

const image = mongoose.model('Image', imageSchema)

module.exports = image