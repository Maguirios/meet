const express = require('express')
const router = express.Router();
const User  = require('../models/User')

router.get('/testcreate', (req, res) => {

    User.create(new User({ email: 'test', password: 'pass123' }))
    .then(user=> console.log('check',user))

    // testUser.save(function(err) {
    //     if (err) throw err;
    // });
})

router.get('/testall', (req, res) => {
    User.find()
        .then(user => {
            console.log('user', user)
        })
})



module.exports = router