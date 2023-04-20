const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
const PORT = 8080;

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

// user database
const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "1234",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "456",
  },
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

// this function checks if the user already exist or not
const userLookup = (email, object) => {
  for (const key in object) {
    if (object[key].email === email) {
      return object[key];
    }
  }
  return null;
};

const urlsForUser = (id) => {
  let userUrls = {};
  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userUrls[key] = urlDatabase[key];
    }
  }
  return userUrls;
};

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: [/* secret keys */],
}));


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
    urls: urlsForUser(req.cookies['user_id']),
    user: users[req.cookies['user_id']]
  };
  if (!req.cookies['user_id']) {
    res.redirect('/login');
    return;
  }
  res.render("urls_index", templateVar);
});

// show the new url page that was created
app.get('/urls/new', (req, res) => {
  if (!req.cookies['user_id']) {
    res.redirect('/login');
    return;
  }
  const templateVar = { user: users[req.cookies['user_id']] };
  res.render("urls_new", templateVar);
});

// render the page for each short url
app.get('/urls/:id', (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('The shortened url does not exist');
    return;
  }
  if (!req.cookies['user_id']) {
    res.status(403).send('Please login first to access this feature');
    return;
  }
  if (req.cookies['user_id'] !== urlDatabase[req.params.id].userID) {
    res.status(403).send('This link does not belog to this user');
    return;
  }
  const templateVar = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies['user_id']]
  };
  res.render("urls_show", templateVar);
});

// redirect the short url to the actual website
app.get("/u/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('The shortened url does not exist');
    return;
  }
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

// render the registration page
app.get('/register', (req, res) => {
  const templateVar = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  if (req.cookies['user_id']) {
    res.redirect('/urls');
    return;
  }
  res.render('user_registration', templateVar);
});

// render the login page
app.get('/login', (req, res) => {
  const templateVar = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  if (req.cookies['user_id']) {
    res.redirect('/urls');
    return;
  }
  res.render('user_login', templateVar);
});



app.post('/urls/:id', (req, res) => {
  if (!req.cookies['user_id']) {
    res.status(403).send('Please login first to access this feature');
    return;
  }
  console.log('what do i get', req.params.id);
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('The requested id to access does not exist');
    return;
  }

  if (req.cookies['user_id'] !== urlDatabase[req.params.id].userID) {
    res.status(403).send('This link does not belog to this user');
    return;
  }
  res.redirect(`/urls/${req.params.id}`);
});

// create a new short url for a given long url
app.post('/urls', (req, res) => {
  if (!req.cookies['user_id']) {
    res.status(403).send('Please login first to access this feature');
    return;
  }
  let id = generateRandomString();
  urlDatabase[id] = { longURL: req.body.longURL, userID: req.cookies['user_id'] };
  res.redirect(`/urls/${id}`);
});

// deletes the url requested by the user
app.post('/urls/:id/delete', (req, res) => {
  if (!req.cookies['user_id']) {
    res.status(403).send('Please login first to access this feature');
    return;
  }
  if (!urlDatabase[req.params.id]) {
    res.status(404).send('The requested id to delete does not exist');
  }
  if (req.cookies['user_id'] !== urlDatabase[req.params.id].userID) {
    res.status(403).send('This link does not belog to this user');
  }
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

// edit the previouse long urls
app.post('/urls/:id/edit', (req, res) => {
  urlDatabase[req.params.id].longURL = req.body.newLongURL;
  res.redirect('/urls');
});

// logs the user in
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('Please provide email address and password');
  }
  const user = userLookup(email, users);
  if (!user) {
    return res.status(403).send('Incorrect email address');
  }
  console.log(password, user.password);
  console.log('what do i get', bcrypt.compareSync(password, user.password));
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send('Incorrect password');
  }
  res.cookie('user_id', user.id);
  res.redirect('/urls');
});

// logout of current user and clear the cookie
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

// register the new user with their email and password and generated id
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  if (!email || !password) {
    return res.status(400).send('Please provide email address and password');
  }
  if (userLookup(email, users)) {
    return res.status(400).send('User with this email address already exists please try a new email');
  }

  users[id] = {
    id,
    email,
    password
  };

  console.log(users);
  res.cookie('user_id', id);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
