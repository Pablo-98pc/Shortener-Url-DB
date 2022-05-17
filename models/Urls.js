const {Schema,model} = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const shortUrlSchema = new Schema({
    url : {
        required:true,
        type:String,
        unique:true
    },
    shortid : {
        type:String,
        unique:true,
        required:true
    }

})

shortUrlSchema.set('toJson',{
    transform : (document,returnedObject) => {
        delete returnedObject.__v
    }
})

const ShortUrl = model('ShortUrl',shortUrlSchema)
shortUrlSchema.plugin(uniqueValidator)

module.exports = ShortUrl
