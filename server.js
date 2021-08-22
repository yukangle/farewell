var express = require('express');
var app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/imgs', express.static(__dirname + '/public/imgs'));

var server = app.listen(8081, function() {
  var port = server.address().port;
  console.log('Server started at port:%s', port);
})