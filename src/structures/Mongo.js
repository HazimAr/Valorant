const { mongoUsername, mongoPassword } = process.env,
  { connect, connection } = require("mongoose");
module.exports = class Mongo {
  constructor(client) {
    this.client = client;

    connect(
      `mongodb+srv://${mongoUsername}:${mongoPassword}@valorant.ymqww.mongodb.net/Valorant?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        poolSize: 5,
        connectTimeoutMS: 10000,
        family: 4,
        useCreateIndex: false,
        useFindAndModify: false,
      }
    );
    //
    connection.on("connected", () => console.log("MongoDB connected"));
    connection.on("disconnected", () =>
      console.log("MongoDB disconnected! - - - - - - - - - - - - -")
    );
    connection.on("err", () =>
      console.log("There was an error connecting to MongoDB")
    );
    //
  }

  async mongoQuery(Schema, method, searchObject, updateObject) {
    try {
      if (method === "getAndUpdate") {
        await Schema.updateMany(searchObject, updateObject, {
          returnDocument: "after",
          upsert: true,
        });
        return await Schema.find(searchObject);
      }
    } catch (err) {
      this.console.error(err?.stack ?? err);
      return err?.stack ?? err;
    }
  }
  //
};
