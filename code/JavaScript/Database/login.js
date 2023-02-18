const MongoClient = require("mongodb").MongoClient;
const crypto = require("crypto");
const chalk = require("chalk");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Users";

async function login_user(username, password) {
  await client.connect();
  const result = await client
    .db(database)
    .collection(collection)
    .findOne({ username: username });
  const decrypted = crypto.privateDecrypt(
    result["private_Key"],
    Buffer.from(result["password"].toString("base64"), "base64")
  );
  if (password.localeCompare(decrypted.toString()) == 0) {
    client.close();
    return true;
  }
  client.close();
  return chalk.red.bold("Incorrect ") + "Password";
}
module.exports = { login_user };
