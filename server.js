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

// app.get('/',async (req,res) =>{ 

//         const shortenedUrls = await ShortenedURL.find()

//     res.render('index',{ shortenedUrls: shortenedUrls})
// })

app.get('/', async (req, res) => {
    const searchQuery = req.query.search;
  
    try {
      let query = {};
  
      if (searchQuery) {
            query = { 
                $or:[
                   { notes : { $regex: searchQuery, $options: 'i' } },
                   { full : { $regex: searchQuery, $options: 'i' } },
                   { shortened : { $regex: searchQuery, $options: 'i' } }
                ]
                }
        }
  
        const shortenedUrls = await ShortenedURL.find(query);
  
        res.render('index', { shortenedUrls : shortenedUrls });

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
  });
  

app.post('/shortenedUrls' ,async (req,res) =>{
    const { fullUrl, notes } = req.body;
    await ShortenedURL.create({ notes,full: req.body.fullUrl})
        const shortenedUrl = new ShortenedURL({
            full: fullUrl,
            notes: notes
        })
        res.redirect('/')
})

app.get('/:shortenedUrl', async (req,res)=>{
        const shortenedUrl = await ShortenedURL.findOne({shortened : req.params.shortenedUrl})
        if ( shortenedUrl == null ) res.sendStatus(404)

        else { shortenedUrl.clicks++
            shortenedUrl.save()}
    res.redirect(shortenedUrl.full)
})

const port = 5000;
app.listen( process.env.PORT || port, ()=> {
    console.log('Server working fine at', port  );
});
