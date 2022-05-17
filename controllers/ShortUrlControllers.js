const shortUrlRouter = require('express').Router()
const ShortUrl = require('../models/Urls')


shortUrlRouter.get('/:shortid',async (request,response)=> {
    try {
        const {shortid} = request.params
        const shortenerUrl = await ShortUrl.findOne({shortid})
        if(!shortenerUrl){
            response.send('Not results found')
        } else {
            response.send(shortenerUrl.url)
        }
        
    } catch (error) {
        console.error(error)
    }
})

module.exports = shortUrlRouter