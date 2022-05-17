const {Schema,model} = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')



const userSchema = new Schema({
    userName : {
        type:String,
        unique:true,
        required:true
    },
    passwordHash: {
        type:String,
        required:true
    }
})

userSchema.set('toJSON',{
    transform : (document,returnedObject) => {
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = model('User',userSchema)
userSchema.plugin(uniqueValidator)

module.exports = User 