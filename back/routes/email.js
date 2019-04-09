const express = require('express');
const app = express.Router();
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('Tq5v8TWWRB4Z6cwQTfZNMw');



var async = false;
var ip_pool = "Main Pool";
var send_at = new Date();


app.post('/sendEmail', function (req, res) {
    mandrill_client.messages.send({ "message": req.body.data, "async": async, "ip_pool": ip_pool, "send_at": send_at }, function (result) {
        console.log(result);
        res.send('ok')
    }, function (e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
})

module.exports = app;