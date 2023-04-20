// this function checks if the user already exist or not
const userLookup = (email, object) => {
  for (const key in object) {
    if (object[key].email === email) {
      return object[key];
    }
  }
  return null;
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

module.exports = { userLookup, generateRandomString};