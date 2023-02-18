const { MongoClient } = require("mongodb");
const Chalk = require("chalk");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const database = "assessment1";
const collection = "Users";

async function register_user(username, password) {
  await client.connect();
  const result = await client
    .db(database)
    .collection(collection)
    .insertOne({ username: username, password: password });
  console.log(Chalk.green.bold("Registration Successfull ") + "👍");
  client.close();
}
register_user("demo3", "demo4");
