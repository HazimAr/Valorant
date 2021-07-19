const Commando = require("discord.js-commando");

module.exports = class AddCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "giveaway",
      aliases: ["raffle"],
      group: "giveaway",
      memberName: "giveaway",
      description: "Starts a giveaway in the same channel you type it in.",
      userPermissions: ["ADMINISTRATOR"],
    });
  }

  async run(message, args) {
    if (!message.guild)
      return message.say(
        ":warning: **This command can only be used in a server!**"
      );

    const giveawayMessage = args;
    if (!giveawayMessage)
      return message.say(
        ":warning: **Please enter a message for the giveaway!**"
      );
    const guild = await this.client.Mongo.MongoGuild.findOne({
      _id: message.guild.id,
    });

    if (!guild.giveaway) guild.giveaway = {};
    const giveaway = guild.giveaway;

    const giveawayReact = await message.say(
      `React to this message to enter ${giveawayMessage} giveaway`
    );
    giveawayReact.react("🎉");
    giveaway.id = message.channel.id;
    giveaway.message = giveawayMessage;
    giveaway.entries = [];
  }
};
