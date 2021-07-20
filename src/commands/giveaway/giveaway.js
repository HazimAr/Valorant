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
      argsType: "multiple",
    });
  }

  async run(message, args) {
    if (!message.guild)
      return message.say(
        ":warning: **This command can only be used in a server!**"
      );

    let giveawayMessage = args;

    const guild = await this.client.Mongo.MongoGuild.findOne({
      _id: message.guild.id,
    });

    if (!guild.giveaways) guild.giveaways = {};

    if (giveawayMessage[0] === "end") {
      console.log("Ending giveaway");
      if (!giveawayMessage[1])
        return message.say(
          ":warning: **Please enter a valid message ID to end the giveaway!**"
        );
      const giveawayMessageObj = guild?.giveaways[giveawayMessage[1]];
      if (!giveawayMessageObj)
        return message.say(":warning: **Invalid message ID!**");
      const winner =
        giveawayMessageObj.entries[
          Math.floor(Math.random() * giveawayMessageObj.entries.length)
        ];
      delete guild.giveaways[giveawayMessageObj.id.message];
      return message.say(
        `Congratulations to ${winner} for winning ${giveawayMessageObj.message}. To claim your prize, message the person who started the giveaway. You must claim your prize in 24 hours or the giveaway will be re-rolled`
      );
    }
    giveawayMessage = giveawayMessage.join(" ");

    if (!giveawayMessage)
      return message.say(
        ":warning: **Please enter a message for the giveaway!**"
      );

    const giveawayReact = await message.say(
      `React to this message to enter **${giveawayMessage}** giveaway.
Un-react if you want to be removed from the giveaway.`
    );

    giveawayReact.react("🎉");
    guild.giveaways[giveawayReact.id] = {
      id: {
        channel: message.channel.id,
        message: giveawayReact.id,
      },
      message: giveawayMessage,
      entries: [],
    };
    console.log(guild.giveaways[giveawayReact.id]);
    guild.markModified("giveaways");
    guild.save();
  }
};
