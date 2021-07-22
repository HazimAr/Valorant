const Commando = require("discord.js-commando");
const { MessageCollector } = require("discord.js");

module.exports = class CreateCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "create",
      group: "custom game",
      memberName: "create",
      description: "Creates a custom game",
      guildOnly: true,
    });
  }

  async run(message) {
    if (!message.guild)
      return message.say(
        ":warning: **This command can only be used in a server!**"
      );
    const guild = await this.client.Mongo.MongoGuild.findOne({
      _id: message.guild.id,
    });

    if (!guild.lobbies) guild.lobbies = {};
    let hit = false;

    Object.keys(guild.lobbies).forEach((key) => {
      if (hit) return;

      if (guild.lobbies[key].author === message.author.id) {
        hit = true;
      }
    });
    if (hit)
      return message.say(
        "You have already created a custom game open. To close it type v!delete"
      );

    const lobby = await message.guild.channels.create(`lobby`, {
      type: "voice",
      userLimit: 10,
    });
    const attacking = await message.guild.channels.create(`attacking`, {
      type: "voice",
      userLimit: 5,
    });
    const defending = await message.guild.channels.create(`defending`, {
      type: "voice",
      userLimit: 5,
    });

    guild.lobbies[lobby.id] = {
      author: message.author.id,
      lobby: lobby.id,
      attacking: attacking.id,
      defending: defending.id,
    };
    guild.markModified("lobbies");
    guild.save();

    message.say(`Your lobby has been created ${lobby} click to join`);
  }
};
