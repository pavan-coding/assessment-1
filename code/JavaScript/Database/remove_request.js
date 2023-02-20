const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Requests";
async function remove_request(username, key) {
  await client.connect();
  await client
    .db(database)
    .collection(collection)
    .updateOne({ username: key }, { $pull: { requests: "running" } });
  client.close();
}
module.exports = { remove_request };
