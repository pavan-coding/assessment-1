const MongoClient = require("mongodb").MongoClient;
const crypto = require("crypto");
const chalk = require("chalk");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Users";

async function user_update_password(username, password, newpassword) {
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
    publicKey = result["public_Key"];
    const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(newpassword));
    newpassword = encrypted.toString("base64");
    await client
      .db(database)
      .collection(collection)
      .updateOne({ username: username }, { $set: { password: newpassword } });

    client.close();
    return true;
  }
  client.close();
  return chalk.redBright("Wrong Password");
}

module.exports = { user_update_password };
