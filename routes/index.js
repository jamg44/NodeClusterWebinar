var express = require('express');
var router = express.Router();
var sleep = require('sleep');
var crypto = require('crypto');  

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/features', function(req, res, next) {
  res.render('features');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});

router.get('/sleep', function (req, res) {
  // Simular retraso en procesado de rutas
  var randSleep = Math.round(10 + (Math.random() * 10));
  sleep.msleep(randSleep);

  var numChars = Math.round(5000 + (Math.random() * 5000));
  var randChars = crypto.randomBytes(numChars).toString('hex');
  res.send(randChars);
});

module.exports = router;
