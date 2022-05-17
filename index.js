require('dotenv').config()
require('./mongo')
require('./graphql')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json()) 
app.use(cors())  
const shortUrlRouter = require('./controllers/ShortUrlControllers')
app.use('/',shortUrlRouter) 



const PORT = 3001
app.listen(PORT,()=> {
    console.log(PORT)
});
