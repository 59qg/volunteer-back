var express = require('express');
var router = express.Router();

var activity = require('./app/activity');
var user = require('./app/user');
var news = require('./app/news');

router.use('/activity', activity);
router.use('/user', user);
router.use('/news', news);

module.exports = router;
