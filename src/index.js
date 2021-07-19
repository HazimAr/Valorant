require("dotenv").config();
const { mongoUsername, mongoPassword, token } = process.env;

const { MongoClient } = require("mongodb");
const MongoDBProvider = require("commando-provider-mongo");
const path = require("path");
const Commando = require("discord.js-commando");

const config = require("./config.json");

const client = new Commando.CommandoClient({
  owner: "682715516456140838",
});

client
  .setProvider(
    MongoClient.connect(
      `mongodb+srv://${mongoUsername}:${mongoPassword}@valorant.ymqww.mongodb.net/Valorant?retryWrites=true&w=majority`
    ).then((client) => new MongoDBProvider(client, "Valorant"))
  )
  .catch((err) => console.error(err));

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
