const express = require('express');
const app = express.Router();
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('zD0Xb_KXdE2oqQerDZfd7g');
const ics = require('ics')



var async = false;
var ip_pool = "Main Pool";
var send_at = new Date();


app.post('/sendEmail', function (req, res) {
    console.log(req.body)
    mandrill_client.messages.sendTemplate({"template_name": req.body.template_name, "template_content": req.body.template_content, "message": req.body.message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function (result) {
        console.log(result);
        res.send('ok')
    }, function (e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
    });
})

module.exports = app;