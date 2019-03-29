const express = require('express');
const morgan = require('morgan');
const app = express();
var path = require('path');

//settings
app.set('port', process.env.PORT || 3000)

//middleware
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.resolve(__dirname, 'public')))

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')
  });


app.listen(app.get('port'), () => {
    console.log('Listening on port 3000')
})