require("dotenv").config();
const { token } = process.env;

const path = require("path");
const Valorant = require("./structures/client");

const client = new Valorant({
  owner: "682715516456140838",
  commandPrefix: "v!",
});

client.once("ready", async () => {
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
  const guilds = await client.Mongo.MongoGuild.find({});
  const promises = [];
  guilds.forEach(async (guild) => {
    if (!guild.giveaways) return;
    const giveaways = Object.keys(guild.giveaways);
    const promises = [];
    giveaways.forEach(async (giveaway) => {
      const giveawayObj = guild.giveaways[giveaway];
      promises.push(
        client.guilds.cache
          .get(guild.id)
          .channels.cache.get(giveawayObj.id.channel)
          .messages.fetch(giveawayObj.id.message)
      );
    });
    promises.push(Promise.all(promises));
  });
  await Promise.all(promises);
});

client.on("guildCreate", (guild) => {
  client.Mongo.getOrMakeGuild(guild.id);
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  const guild = await client.Mongo.MongoGuild.findOne({
    _id: reaction.message.guild.id,
  });

  if (!guild.giveaways) return;

  const giveaways = Object.keys(guild.giveaways);

  if (!giveaways.includes(reaction.message.id)) return;

  guild.giveaways[reaction.message.id].entries.push(user);
  user.send(
    `You have been entered into **${
      guild.giveaways[reaction.message.id].message
    }** :sunglasses:`
  );
  guild.markModified("giveaways");
  guild.save();
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) return;

  const guild = await client.Mongo.MongoGuild.findOne({
    _id: reaction.message.guild.id,
  });

  if (!guild.giveaways) return;

  const giveaways = Object.keys(guild.giveaways);

  if (!giveaways.includes(reaction.message.id)) return;

  guild.giveaways[reaction.message.id].entries = guild.giveaways[
    reaction.message.id
  ].entries.filter((ele) => ele !== user.id);
  // .slice(guild.giveaways[reaction.message.id].entries.indexOf(user), 1);
  user.send(
    `You have been Removed from **${
      guild.giveaways[reaction.message.id].message
    }** :sob:`
  );
  guild.markModified("giveaways");
  guild.save();
});

client.login(token);
