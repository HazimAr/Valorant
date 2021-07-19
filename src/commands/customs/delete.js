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
    let game;
    Object.keys(guild.lobbies).forEach((key) => {
      if (hit) return;
      if (guild.lobbies[key].author === message.author.id) {
        hit = true;
        game = guild.lobbies[key];
      }
    });

    if (!hit)
      return message.say("You don't have any custom game open right now.");

    message.guild.channels.cache.get(game.lobby).delete(),
      message.guild.channels.cache.get(game.attacking).delete(),
      message.guild.channels.cache.get(game.defending).delete(),
      delete guild.lobbies[`${game.id}`];
    guild.markModified("lobbies");
    guild.save();

    message.say(`Your lobby has been deleted`);
  }
};
