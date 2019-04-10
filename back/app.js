const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');


const app = express();
var path = require("path");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var ACCOUNT_SID = "AC57fce1c805d18eb21e57141b5f1e8efc";
var AUTH_TOKEN = "40966e8f9706a92a9852619a30ad283c";
var API_KEY = "SKee2c7176559ef5cbf1fd5beacfa6e872"
var API_SECRET ="jpAqNvuLvbLvhgUxSG3vw9Di1TA814Sf"
const Twilio = require("twilio");

const client = new Twilio(ACCOUNT_SID, API_SECRET, { accountSid: ACCOUNT_SID });
const faker = require("faker");

const apiRoutes = require('./routes/email');

app.set("port", process.env.PORT || 3000);

//middleware
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname + "/public")));

app.use('/api', apiRoutes);


app.get("/token", function(request, response) {
  var identity = faker.name.findName();
  var token = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET, AUTH_TOKEN);
  token.identity = identity;
  const grant = new VideoGrant();
  token.addGrant(grant);
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});                                                                                                                        

  app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
  })

app.listen(app.get("port"), () => {
  console.log("Listening on port 4000");
});
