const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Requests";

async function add_request(from_username, to_username) {
  await client.connect();
  const result = await client
    .db(database)
    .collection(collection)
    .find({ username: to_username })
    .toArray();
  if (result.length > 0) {
    await client
      .db(database)
      .collection(collection)
      .updateOne(
        { username: to_username },
        { $addToSet: { requests: from_username } }
      );
  } else {
    await client
      .db(database)
      .collection(collection)
      .insertOne({ username: to_username, requests: [from_username] });
  }
  client.close();
}

module.exports = { add_request };
