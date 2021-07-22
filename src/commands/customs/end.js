const Commando = require("discord.js-commando");
const { MessageCollector } = require("discord.js");

module.exports = class DeleteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "end",
      aliases: ["endlobby", "endgame", "stop"],
      group: "custom game",
      memberName: "end",
      description: "Ends your current custom game if applicable.",
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
    let game;
    Object.keys(guild.lobbies).forEach((key) => {
      if (hit) return;
      if (guild.lobbies[key].author === message.author.id) {
        hit = true;
        game = guild.lobbies[key];
      }
    });

    if (!hit)
      return message.say(
        "You don't have any custom game open right now. To create a custom game type v!create"
      );

    const lobby = message.guild.channels.cache.get(game.lobby);
    const attacking = message.guild.channels.cache.get(game.attacking);
    const defending = message.guild.channels.cache.get(game.defending);

    attacking.members.forEach((member) => {
      member.voice.setChannel(lobby);
    });

    defending.members.forEach((member) => {
      member.voice.setChannel(lobby);
    });

    message.say(`Your lobby has been ended`);
  }
};
