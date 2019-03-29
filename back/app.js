const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
var path = require('path');

//conecting to db
mongoose.connect('mongodb://localhost/meet',{useNewUrlParser : true})
.then(db => console.log('db connected'))
.catch(err => console.log(err))

const apiRoutes = require('./routes/index')

//settings
app.set('port', process.env.PORT || 3000)

//middleware
app.use(morgan('dev'))


app.use('/api', apiRoutes);
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.resolve(__dirname, 'public')))

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
  });


app.listen(app.get('port'), () => {
    console.log('Listening on port 4000')
})