const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Requests";
async function remove_request(username, key) {
  await client.connect();
  const result = await client
    .db(database)
    .collection(collection)
    .findOne({ username: username, requests: { $in: [key] } });
  await client
    .db(database)
    .collection(collection)
    .updateOne({ username: username }, { $pull: { requests: key } });
  if (result != null) {
    client.close();
    return true;
  }
  client.close();
  return false;
}
module.exports = { remove_request };
