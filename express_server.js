const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const PORT = 8080;


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// the function below makes a random string that has a length of 6 characters
const generateRandomString = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};


app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// implement the hello page
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// render the urls page
app.get('/urls', (req, res) => {
  const templateVar = {
    urls: urlDatabase,
    username: req.cookies['username']
  };
  res.render("urls_index", templateVar);
});

// show the new url page that was created
app.get('/urls/new', (req, res) => {
  const templateVar = { username: req.cookies['username'] };
  res.render("urls_new", templateVar);
});


app.get('/urls/:id', (req, res) => {
  const templateVar = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies['username']
  };
  res.render("urls_show", templateVar);
});

// redirect the short url to the actual website
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// render the login page
app.get('/register', (req, res) => {
  const templateVar = {
    urls: urlDatabase,
    username: req.cookies['username']
  };
  res.render('user_registration', templateVar);
});

app.post('/urls/:id', (req, res) => {
  // const templateVar = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.redirect(`/urls/${req.params.id}`);
});

// create a new short url for a given long url
app.post('/urls', (req, res) => {
  // console.log(req.body);
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${id}`);
});

// deletes the url requested by the user
app.post('/urls/:id/delete', (req, res) => {
  // console.log('what i get', req.params.id);
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

// edit the previouse long urls
app.post('/urls/:id/edit', (req, res) => {
  // console.log('what i get', req.body);
  urlDatabase[req.params.id] = req.body.newLongURL;
  res.redirect('/urls');
});

// creates a username login for the user
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

// logout of current username and clear the cookie
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
