var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  if (req.hostname !== 'localhost') {
    return next();
  }

  if (req.query.c === 'suicide') process.nextTick(() =>
    process.exit(0)
  );

  if (req.query.c === 'restart') process.nextTick(() =>
    process.send({cmd:'restart'})
  );

  res.send('ok');
});

module.exports = router;
