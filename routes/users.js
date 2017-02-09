var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test1', function(req, res, next) {
  res.send('test1');
});

router.get('/test2', function(req, res, next) {
  res.send('test2');
});

router.get('/test2', function(req, res, next) {
  res.send('test2');
});

module.exports = router;
