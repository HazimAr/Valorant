require("dotenv").config();
const { token } = process.env;

const path = require("path");
const Valorant = require("./structures/Client");

const client = new Valorant({
  owner: "682715516456140838",
  commandPrefix: "v!",
});

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

client.on("guildCreate", (guild) => {
  client.Mongo.getOrMakeGuild(guild.id);
});

client.login(token);
