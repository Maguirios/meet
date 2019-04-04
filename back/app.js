const express = require("express");
const morgan = require("morgan");

const app = express();
var path = require("path");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var ACCOUNT_SID = "AC57fce1c805d18eb21e57141b5f1e8efc";
var AUTH_TOKEN = "40966e8f9706a92a9852619a30ad283c";
var API_KEY = "SK744ef8158a03f00ebfc7fd9f3d274da4";
var API_SECRET = "C3kgAmOhsuIdjpGgmAOiidQJ2aMvP7zx";
const Twilio = require("twilio");

const client = new Twilio(ACCOUNT_SID, API_SECRET, { accountSid: ACCOUNT_SID });
const faker = require("faker");

// const routes = require("./routes/index");

app.set("port", process.env.PORT || 3000);

//middleware
app.use(morgan("dev"));

// app.use("/", routes);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));

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

client.video.compositions.
  create({
    roomSid: 'RMXXXX',
    audioSources: '*',
    videoLayout: {
      grid : {
        video_sources: ['*']
      }
    },
    statusCallback: 'http://my.server.org/callbacks',
    format: 'mp4'
  })
  .then(composition =>{
    console.log('Created Composition with SID=' + composition.sid);
  });                                                                                                                                        
  
app.listen(app.get("port"), () => {
  console.log("Listening on port 4000");
});
