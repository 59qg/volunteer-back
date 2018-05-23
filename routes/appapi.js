var express = require('express');
var router = express.Router();

var activity = require('./app/activity');
var user = require('./app/user');

router.use('/activity', activity);
router.use('/user', user);

module.exports = router;
