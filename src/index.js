require("dotenv").config();
const { token } = process.env;

const path = require("path");
const { CommandoClient } = require("discord.js-commando");
const { mongoUrl } = process.env,
  { connect, connection } = require("mongoose");
const { MongoGuild, createGuild } = require("./schemas/guild.js");

class Mongo {
  constructor(client) {
    this.client = client;

    connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
      useCreateIndex: false,
      useFindAndModify: false,
    });
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
}

class Valorant extends CommandoClient {
  constructor(options) {
    super(options);
    this.Mongo = {
      new: new Mongo(this),
      MongoGuild,
      getOrMakeGuild: async (id) => {
        let guild = await MongoGuild.findOne({ _id: id });
        if (!guild) {
          const g = await this.guilds.fetch(id);
          guild = new MongoGuild(await createGuild(id, g.name));
        }
        return guild;
      },
    };
  }
}

const client = new Valorant({
  owner: "682715516456140838",
  commandPrefix: "v!",
});

client.once("ready", async () => {
  client.user.setActivity("v!help", {
    type: "LISTENING",
  });
  client.removeListener("message", client._events.message[0]);
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
      const guild2 = await client.guilds.cache.get(guild.id);
      if (!guild2) return;
      promises.push(
        guild2.channels.cache
          .get(giveawayObj.id.channel)
          .messages.fetch(giveawayObj.id.message)
      );
    });
    promises.push(Promise.all(promises));
  });
  await Promise.all(promises);
});

client.on("message", async (message) => {
  if (message.bot) return;
  try {
    const guild = await client.Mongo.MongoGuild.findOne({
      _id: message.guild.id,
    });
  } catch (err) {
    client.dispatcher
      .handleMessage(message)
      .catch((err) => client.emit("error", err.stack ? err.stack : err));
    return;
  }
  const prefix = guild.prefix;

  if (message.content.startsWith(prefix)) {
    message.content = message.content.replace(prefix ?? "v!", "v!");
  }
  if (message.content.startsWith(`<@!${client.user.id}>`)) {
    message.content = message.content.replace(`<@!${client.user.id}>`, "v!");
  }
  client.dispatcher
    .handleMessage(message)
    .catch((err) => client.emit("error", err.stack ? err.stack : err));
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
  try {
    user.send(
      `You have been Removed from **${
        guild.giveaways[reaction.message.id].message
      }** :sob:`
    );
  } catch {}

  guild.markModified("giveaways");
  guild.save();
});

client.login(token);
