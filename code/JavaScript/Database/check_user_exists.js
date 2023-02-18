const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Users";

async function check(username) {
  await client.connect();
  const result = await client
    .db(database)
    .collection(collection)
    .findOne({ username: username });
  if (result) {
    client.close();
    return false;
  }
  client.close();
  return true;
}
module.exports = { check };
