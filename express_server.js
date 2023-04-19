const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const PORT = 8080;


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// user database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
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
    // console.log('current email of the object', object[key].email);
    // console.log('email sent', email);
    // console.log('current key', key);
    if (object[key].email === email) {
      return object[key];
    }
  }
  return null;
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
    user: users[req.cookies['user_id']]
  };
  res.render("urls_index", templateVar);
});

// show the new url page that was created
app.get('/urls/new', (req, res) => {
  const templateVar = { user: users[req.cookies['user_id']] };
  res.render("urls_new", templateVar);
});


app.get('/urls/:id', (req, res) => {
  const templateVar = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies['user_id']]
  };
  res.render("urls_show", templateVar);
});

// redirect the short url to the actual website
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// render the registration page
app.get('/register', (req, res) => {
  const templateVar = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  res.render('user_registration', templateVar);
});

// render the login page
app.get('/login', (req, res) => {
  const templateVar = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']]
  };
  res.render('user_login', templateVar);
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
  res.redirect('/login');
});

// logout of current username and clear the cookie
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// register the new user with their email and password and generated id
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Please provide email address and password');
  }
  if (userLookup(email, users)) {
    return res.status(400).send('User with this email address already exists please try a new email');
  }
  console.log('email', email, 'password', password);
  users[id] = {
    id,
    email,
    password
  };
  console.log(users[id]);
  console.log(users);
  
  res.cookie('user_id', id);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
