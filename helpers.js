// this function checks if the user already exist or not
const userLookup = (email, object) => {
  for (const key in object) {
    if (object[key].email === email) {
      return object[key];
    }
  }
  return null;
};
module.exports = { userLookup };