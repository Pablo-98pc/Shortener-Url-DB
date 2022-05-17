const {Schema,model} = require('mongoose');

const savedUrlsSchema = new Schema({
    url:{
        required:true,
        type:String
    },
    urlName:{
        required:true,
        type:String
    },
    userName:{
        required:true,
        type:String
    }
})

savedUrlsSchema.set('toJson',{
    transform : (document,returnedObject) => {
        delete returnedObject.__v
    }
})

const savedUrls = model('savedUrls',savedUrlsSchema)
module.exports = savedUrls
