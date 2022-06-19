const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./shortUrl');
const cors = require('cors')
const app = express();
require('dotenv/config')


app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs'); //syntax to set EJS as the view engine in our express app - express knows to resolve automatically when we render
// using res.render() will send a view to the user - by default express looks inside a "views" folder when resolving template files


app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find() // loop through db collection
    res.render('index', { shortUrls: shortUrls}) // calling res.render() will send a rendered HTML string to client 
    // renders the "view provided" in first argument
    // method combines data with templates - done by passing second argument
    

})

app.post('/shortUrl', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl ==  null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})








mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to db"));

const port = process.env.PORT || 7979;

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});