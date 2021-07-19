const Commando = require("discord.js-commando");
const { MessageCollector } = require("discord.js");

module.exports = class DeleteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "delete",
      group: "custom game",
      memberName: "delete",
      description: "Deletes your current custom game if applicable.",
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
      if (key.author === message.author.id) {
        hit = true;
      }
    });

    if (!hit)
      return message.say("You don't have any custom games open right now.");

    delete guild.lobbies[`${lobby.id}`];

    guild.lobbies[`${lobby.id}`] = {
      author: message.author.id,
      attacking: attacking.id,
      defending: defending.id,
    };

    guild.save();

    message.say(`Your lobby has been deleted`);
  }
};
