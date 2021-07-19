require("dotenv").config();
const { token } = process.env;

// const { mongoUsername, mongoPassword } = process.env;
// const { MongoClient } = require("mongodb");
// const MongoDBProvider = require("commando-provider-mongo");

const path = require("path");
const Commando = require("discord.js-commando");

const client = new Commando.CommandoClient({
  owner: "682715516456140838",
  commandPrefix: "v!",
});

// client
//   .setProvider(
//     MongoClient.connect(
//       `mongodb+srv://${mongoUsername}:${mongoPassword}@valorant.ymqww.mongodb.net/Valorant?retryWrites=true&w=majority`,
//       { useUnifiedTopology: true }
//     ).then((client) => new MongoDBProvider(client, "Valorant"))
//   )
//   .catch((err) => console.error(err));

client.once("ready", () => {
  console.log("Ready!");

  client.registry
    .registerGroups([
      ["misc", "Misc commands"],
      ["moderation", "Moderation commands"],
      ["custom game", "Custom Game commands"],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, "commands"));
});

client.login(token);
