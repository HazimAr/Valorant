const config = require("./config.json");
const Commando = require("discord.js-commando");
const path = require("path");

const client = new Commando.CommandoClient({
  owner: "682715516456140838",
  commandPrefix: config.prefix,
});

client.once("ready", () => {
  console.log("Ready!");

  client.registry
    .registerGroups([
      ["misc", "Misc commands"],
      ["moderation", "Moderation commands"],
      ["custom game", "Custom Game commands"],
    ])
    .registerCommandsIn(path.join(__dirname, "commands"))
    .registerDefaults();
});

client.login(config.token);
