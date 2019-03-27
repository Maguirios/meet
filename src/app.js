const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

//conecting to db
mongoose.connect('mongodb://localhost/meet')
.then(db => console.log('db connected'))
.catch(err => console.log(err))

const routes = require('./routes/index')

//settings
app.set('port', process.env.PORT || 3000)

//middleware
app.use(morgan('dev'))


app.use('/', routes);
app.use(express.urlencoded({extended: false}))


app.listen(app.get('port'), () => {
    console.log('Listening on port 4000')
})