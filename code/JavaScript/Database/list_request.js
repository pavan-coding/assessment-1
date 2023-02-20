const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Requests";

async function list_client_requested(username) {
  await client.connect();
  let result = await client
    .db(database)
    .collection(collection)
    .find({ username: username })
    .toArray();
  await client.close();
  if (result.length > 0) {
    result = result[0]["requests"];
  } else result = [];
  return result;
}
module.exports = { list_client_requested };
