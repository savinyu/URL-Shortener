const express = require('express')

const app = express()

const mongod = require('mongoose')

const ShortenedURL = require('./models/shortenedUrl') 
let uri = 'mongodb+srv://savinyu:1234567890@urlshortener.gc6godh.mongodb.net/?retryWrites=true&w=majority'

mongod.connect(uri,{
    useNewUrlParser: true, useUnifiedTopology: true
})
// mongod.connect('mongodb://127.0.0.1:27017',{
//     useNewUrlParser: true, useUnifiedTopology: true
// })

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}))

app.get('/',async (req,res) =>{ 

        const shortenedUrls = await ShortenedURL.find()

    res.render('index',{ shortenedUrls: shortenedUrls})
})

app.post('/shortenedUrls' ,async (req,res) =>{
        // await ShortenedURL.create({full: req.body.fullUrl})
        const { fullUrl, notes } = req.body
            res.redirect('/')
        const shortenedUrl = new ShortenedURL({
            full: fullUrl,
            notes: notes
        })
})

app.get('/:shortenedUrl', async (req,res)=>{
        const shortenedUrl = await ShortenedURL.findOne({shortened : req.params.shortenedUrl})
        if ( shortenedUrl == null ) res.sendStatus(404)

        else { shortenedUrl.clicks++
            shortenedUrl.save()}
    res.redirect(shortenedUrl.full)
})

app.listen( process.env.PORT || 5000);