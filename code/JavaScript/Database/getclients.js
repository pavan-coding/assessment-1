const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Online_clients";

async function list_clients() {
  await client.connect();
  const result = await client
    .db(database)
    .collection(collection)
    .find({}, { username: 1, _id: 0 });
  const answer = await result.toArray();

  client.close();
  return answer;
}
module.exports = { list_clients };
