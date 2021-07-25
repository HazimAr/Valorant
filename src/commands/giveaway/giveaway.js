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
      guildOnly: true,
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
      if (!giveawayMessage[1])
        return message.say(
          ":warning: **Please enter a valid message ID to end the giveaway!**"
        );
      const giveawayMessageObj = guild.giveaways[giveawayMessage[1]];
      if (!giveawayMessageObj)
        return message.say(
          ":warning: **That giveaway message does not exist!**"
        );
      if (giveawayMessageObj.entries.length === 0)
        return message.say(":warning: **Nobody signed up for the giveaway!**");
      console.log(giveawayMessage);
      if (giveawayMessage[2]) {
        let amountOfWinners = 0;
        try {
          amountOfWinners = parseInt(giveawayMessage[2]);
        } catch {
          return message.say(
            ":warning: **Please enter a valid number of winners!**"
          );
        }
        if (amountOfWinners > giveawayMessageObj.entries.length) {
          const winners = [];
          for (let i = 0; i < amountOfWinners; i++) {
            const randomArrayIndex = Math.floor(
              Math.random() * giveawayMessageObj.entries.length
            );
            winners.push(giveawayMessageObj.entries[randomArrayIndex]);
            delete giveawayMessageObj.entries[randomArrayIndex];
          }
          return message.say(
            `Congratulations to ${() =>
              winners.map((winner) => `<@${winner}> `)}for winning **${
              giveawayMessageObj.message
            }**.
To claim your prize, message the person who started the giveaway. You must claim your prize in 24 hours or the giveaway will be re-rolled`
          );
        }
      }
      const winner =
        giveawayMessageObj.entries[
          Math.floor(Math.random() * giveawayMessageObj.entries.length)
        ];
      delete guild.giveaways[giveawayMessageObj.id.message];

      // guild.markModified("giveaways");
      // guild.save();

      return message.say(
        `Congratulations to <@${winner}> for winning **${giveawayMessageObj.message}**.
To claim your prize, message the person who started the giveaway. You must claim your prize in 24 hours or the giveaway will be re-rolled`
      );
    }
    if (giveawayMessage[0] === "delete") {
      delete guild.giveaways[giveawayMessageObj.id.message];

      guild.markModified("giveaways");
      guild.save();
      return;
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

    await giveawayReact.react("🎉");
    guild.giveaways[giveawayReact.id] = {
      id: {
        channel: message.channel.id,
        message: giveawayReact.id,
      },
      message: giveawayMessage,
      entries: [],
    };
    guild.markModified("giveaways");
    guild.save();
  }
};
