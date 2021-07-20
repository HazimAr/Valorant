require("dotenv").config();
const { token } = process.env;

const path = require("path");
const Valorant = require("./structures/client");

const client = new Valorant({
  owner: "682715516456140838",
  commandPrefix: "va!",
});

client.once("ready", () => {
  client.user.setActivity("v!help", {
    type: "LISTENING",
  });
  client.registry
    .registerGroups([
      ["misc", "Misc commands"],
      ["moderation", "Moderation commands"],
      ["custom game", "Custom Game commands"],
      ["valorant", "Valorant commands"],
      ["giveaway", "Giveaway commands"],
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, "commands"));
});

client.on("guildCreate", (guild) => {
  client.Mongo.getOrMakeGuild(guild.id);
});

client.on("messageReactionAdd", async (reaction, user) => {
  const guild = await client.Mongo.MongoGuild.findOne({
    _id: reaction.message.guild.id,
  });
  if (!guild.giveaways) return;
  const giveaways = Object.Keys(guild.giveaways);
  if (giveaways.includes(reaction.message.id)) {
    guild.giveaways[reaction.message.id].reactions.push(user);
  }
  user.send(
    `You have been entered into ${guild.giveaways[reaction.message.id.message]}`
  );
  guild.markModified("giveaways");
  guild.save();
});

client.login(token);
