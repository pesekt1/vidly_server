// this is not used anywhere - its just to show how it works - create salt, hash the password with salt.
//run in the terminal: node hash.js

const bcrypt = require("bcrypt");

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("1234", salt);
  console.log(salt);
  console.log(hashed);
}
run();
