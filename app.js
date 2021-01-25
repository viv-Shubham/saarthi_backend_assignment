const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys');
const ejs = require('ejs');
const fetch = require('node-fetch');
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => console.log(err));

mongoose.connection.on('connected', () => {
  console.log('connected ;)');
});
mongoose.connection.on('error', (err) => {
  console.log('error connecting :(  : ', err);
});

app.use(express.static('public'));
app.set('view engine', 'ejs');
require('./user.js');
app.use(express.json());
app.use(require('./routes/auth'));
const User = mongoose.model('User');

app.get('/', (req, res) => {
  if (req.user) res.redirect('/input');
  else res.redirect('/signup');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});
app.get('/signin', (req, res) => {
  res.render('signin');
});
app.get('/input', (req, res) => {
  res.render('input');
});
app.post('/input', (req, res) => {
  let url = req.body.url;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let myData = JSON.stringify(data);
      console.log(req.user);
      // User.findByIdAndUpdate(
      //   req.user._id,
      //   {
      //     $push: { data: { url: myData } },
      //   },
      //   {
      //     new: true,
      //   }
      // ).exec((err, result) => {
      //   if (err) {
      //     return res.status(422).json({ error: err });
      //   }
      // });
      res.render('output', { data: myData });
    })
    .catch((err) => console.log(err));
});
app.listen(PORT, () => {
  console.log('Server running on port : ', PORT);
});
