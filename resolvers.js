const {PubSub} = require('graphql-subscriptions') 
const bcrypt = require('bcrypt')
const jtw = require('jsonwebtoken')
const User = require('./models/User')
const ShortUrl = require('./models/Urls')
const savedUrls = require('./models/savedUrls')
const shortId = require('shortid')
const sub = new PubSub();


const resolvers = {
    Query : {
        userCount : () => User.collection.countDocuments(),
        allUsers : async () =>{
           return User.find({})  
        },
        urlSavedByUser : async (root,args) => {
            const {userName} = args
            return  await savedUrls.find({userName})
        },
        lastUrl : async () => {
            const shortUrls = await ShortUrl.find({});
            const lastShortUrl = shortUrls[shortUrls.length -1]
            const value = `localhost:3000/${lastShortUrl.shortid}`
            return value
        } ,
        urlCount : () => ShortUrl.collection.countDocuments()

        
    },
    Mutation : {
        registerUser : async (root,args) => {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(args.password,saltRounds)
            const Newuser = new User({
                userName : args.userName,
                passwordHash })
            try {
                const savedUser = await Newuser.save()
                const userToken = {
                    id: savedUser._id,
                    userName:savedUser.userName
                    }
                return {value : jtw.sign(userToken,process.env.SECRET),userName:args.userName}
            } catch (error) {
                throw new UserInputError(error.message,{
                    invalidArgs : args
                })
            }
        },
        login : async (root,args) => {
            const user = await User.findOne({userName:args.userName})
            const passwordCorrect = user === null 
            ? false
            : await bcrypt.compare(args.password,user.passwordHash)
            if(!(user && passwordCorrect)){
                throw new UserInputError('wrongs username or password')
            }
            const userToken = {
                id : user._id,
                userName : user.userName
            }
            return {value : jtw.sign(userToken,process.env.SECRET),userName:args.userName}

        },
        createUrl : async (root,args) => {
            try {
                const urlExists = await ShortUrl.findOne({url: args.url})
                if(urlExists){
                    return {value:`localhost:3000/${urlExists.shortid}`}
                }else {
                    let shortIdExists
                    let newShortid
                    do {
                        newShortid = shortId.generate()
                        shortIdExists = await ShortUrl.findOne({shortid:newShortid})
                    }while(shortIdExists) 
                    const shortUrl = new ShortUrl({
                        url:args.url,
                        shortid:newShortid
                    })
                    await shortUrl.save()
                    const updateUrlCount = ShortUrl.collection.countDocuments()
                    sub.publish('LATEST_COUNT',{updateUrlCount})
                    const value = `localhost:3000/${shortUrl.shortid}`
                    sub.publish('LATEST_URL',{latestUrl : {value}})
                    return {value}
                }
            } catch (error) {
                console.error(error)
            }
            
        },
        addUrl : async (root,args) => {
            const urlExists = await savedUrls.findOne({userName:args.userName,url:args.url})
            if(urlExists){
                throw new UserInputError('url already saved')
            }
            const urlToSave = new savedUrls({
                userName:args.userName,
                url:args.url,
                urlName:args.urlName
            })
            await urlToSave.save()
            return urlToSave

        }
    },
    Subscription  : {
        latestUrl : {
            subscribe : () => sub.asyncIterator('LATEST_URL')
        },
        updateUrlCount : {
            subscribe : () => sub.asyncIterator('LATEST_COUNT')
        }
    }
};

module.exports = resolvers