const express = require('express');
const fileUpload = require('express-fileupload');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const app = express();

const oneDay = 1000 * 60 * 60 * 24;
const INVITATIONCODE = "123456";

function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

app.use(sessions({
  secret: "privatesessionsecret-kangleyu",
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}));

app.use(fileUpload({
  createParentPath: true,
    limits: { 
        fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/imgs', express.static(__dirname + '/public/imgs'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/photos', express.static(__dirname + '/data/images'));

app.use(function (err, req, res, next) {
  console.log("error");
  console.error(err.stack)
  res.status(500).sendFile('public/500.html')
})

app.get('/', (req, res) => {
  console.log('/');
  session = req.session;
  if (session.userid) {
    res.cookie("username", session.userid);
    res.status(301).redirect('/home');
  } else {
    res.sendFile('public/login.html', { root: __dirname });
  }
});

app.post('/home', (req, res) => {
  console.log('/home');
  if (req.body.username && req.body.invitationcode == INVITATIONCODE) {
    session = req.session;
    session.userid = req.body.username;
    res.cookie("username", session.userid);
    res.status(301).sendFile('public/home.html', { root: __dirname });
  } else {
    res.status(401).sendFile('public/401.html', { root: __dirname });
  }
});

app.get('/new', (req, res) => {
  console.log('/new');
  session = req.session;
  if (session.userid) {
    res.cookie("username", session.userid);
    res.status(301).sendFile('public/new.html', { root: __dirname });
  } else {
    res.sendFile('public/login.html', { root: __dirname });
  }
});

app.get('/logout', (req, res) => {
  console.log('/logout');
  req.session.destroy();
  res.status(301).redirect('/');
});

app.get('/cards', (req, res) => {
  console.log('/cards');
  fs.readFile('data/data.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
        res.status(500).sendFile('public/500.html', { root: __dirname });
    } else {

        // parse JSON string to JSON object
        const cards = JSON.parse(data);
        res.status(200).json(cards);
    }
  });
});

app.post('/upload', async (req, res) => {
  try {
    console.log('/upload');
    session = req.session;
    if (session.userid) {
      res.cookie("username", session.userid);
      if (!req.files) {
        res.status(500).sendFile('public/500.html', { root: __dirname });
      } else {
        let photo = req.files.photo;
        var newCard = { "username": session.userid };
        newCard.descritpion = req.body.sentence;
        newCard.imageId = photo.name;
        newCard.date = (new Date(Date.now())).toDateString();
        newCard.id = uuid();

        fs.readFile('./data/data.json', 'utf8', (err, data) => {

          if (err) {
              console.log(`Error reading file from disk: ${err}`);
              res.status(500).sendFile('public/500.html', { root: __dirname });
          } else {
              const databases = JSON.parse(data);
              databases.push(newCard);
              fs.writeFile('./data/data.json', JSON.stringify(databases, null, 4), (err) => {
                  if (err) {
                      console.log(`Error writing file: ${err}`);
                      res.status(500).sendFile('public/500.html', { root: __dirname });
                  }
              });
          }
        });
        photo.mv('./data/images/' + photo.name);

        res.status(301).sendFile('public/home.html', { root: __dirname });
      }

    } else {
      res.sendFile('public/login.html', { root: __dirname });
    }
    
  } catch(err) {
    res.status(500).send(err);
  }
})

app.get('*', (req, res) => {
  console.log('unmatched route');
  res.status(404).sendFile('public/404.html', { root: __dirname })
})

var server = app.listen(8081, function() {
  var port = server.address().port;
  console.log('Server started at port:%s', port);
});