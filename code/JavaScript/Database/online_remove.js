const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Online_clients";

async function remove_user(username) {
  await client.connect();
  await client
    .db(database)
    .collection(collection)
    .deleteOne({ username: username });
  client.close();
}

module.exports = { remove_user };
