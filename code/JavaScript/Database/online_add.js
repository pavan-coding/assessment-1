const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Online_clients";

async function add_user(username) {
  await client.connect();
  const result = await client
    .db(database)
    .collection(collection)
    .insertOne({ username: username });
  client.close();
}

module.exports = { add_user };
