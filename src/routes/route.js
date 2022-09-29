const express = require('express');
const router = express.Router();
const Urlcontroller=require('../Controllers/UrlController.js')


router.get('/test-me', function (req, res) {
    res.send('My second ever api!')
});


module.exports = router