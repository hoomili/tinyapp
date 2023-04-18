const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    randomString += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomString;
};

app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get('/urls', (req, res) => {
  const templateVar = { urls: urlDatabase };
  res.render("urls_index", templateVar);
});
app.get('/urls/new', (req, res) => {
  res.render("urls_new");
});
app.get('/urls/:id', (req, res) => {
  const templateVar = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVar);
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${id}`);
});
app.post('/urls/:id/delete', (req, res) => {
  // console.log('what i get', req.params.id);
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});
app.post('/urls/:id/edit', (req, res) => {
  // console.log('what i get', req.body);
  urlDatabase[req.params.id] = req.body.newLongURL;
  res.redirect('/urls');
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
