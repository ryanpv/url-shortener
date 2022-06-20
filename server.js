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
    // renders the "view provided" in first argument (which file you want to render)
    // method combines data with templates - done by passing second argument, which must be an (specific)object accessible in EJS template file (<%= content%>)


})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl }) // loops through db collection for search for single item in schema object - which is the "short:"
    // short will be specified by req.params
    if (shortUrl ==  null) return res.sendStatus(404)

    shortUrl.clicks++ // increments count for clicks for the single found item
    shortUrl.save() // save the instance of this model each time this get request is performed - increment count would be saved
    console.log("here is your object: ", shortUrl);
    res.redirect(shortUrl.full) // redirects to specific db object from the findOne() - link accessed with dot notation to "full" header
})

app.post('/shortUrl', async (req, res) => {
    const urlData = await ShortUrl.create({ full: req.body.fullUrl, short: '100' }) // post request made to db collecting using create() - item to be created is the full url 
    console.log(urlData);
    res.redirect('/') // redirect to specified url - which in this case is index
})

// ____________________________________________
app.delete('/', async (req, res) => {
    const urlDelete = await ShortUrl.deleteOne({ short: req.params.shortUrl })
    console.log(urlDelete);
    res.redirect('/')
})
// ____________________________________________









mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to db"));

const port = process.env.PORT || 7979;

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});