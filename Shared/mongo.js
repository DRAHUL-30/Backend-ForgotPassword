const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.URL);

module.exports = {
  db: null,
  users: null,

  async connect() {
    await client.connect();
    console.log("connected to mongoDB", process.env.URL);

    this.db = client.db(process.env.Mongo_NAME);
    this.users = this.db.collection("users");
  },
};
