const Commando = require("discord.js-commando");

module.exports = class StartCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "start",
      group: "custom game",
      memberName: "start",
      description:
        "Will start a custom game, Randomize Teams, Randomize Map, and drag everyone to their respected voice channel",
    });
  }

  async run(message) {
    if (!message.guild) {
      return message.channel.send(
        "Please send this command in a guild to continue"
      );
    }

    const user = message.guild.members.cache.get(message.author.id);
    const channel = user.voice.channel;

    if (!channel) {
      return message.channel.send(
        "Please join a voice channel before running this command"
      );
    }
    const players = channel.members
      .map((member) => {
        return member.user;
      })
      .sort(() => Math.random() - 0.5);
    // if (players.length <= 2) {
    //   return message.channel.send(
    //     "There must be more then 2 players in the voice channel to start"
    //   );
    // }

    const randomBoolean = Math.random() >= 0.5;
    const middleOfPlayersArray = Math.floor(players.length / 2);

    let attacking;
    let defending;
    if (randomBoolean) {
      attacking = players;
      defending = players.splice(middleOfPlayersArray);
    } else {
      defending = players;
      attacking = players.splice(middleOfPlayersArray);
    }

    message.channel.send(`Attacking: ${attacking.join(", ")}
Defending: ${defending.join(", ")}

Players will be moved to their respective voice channels`);
  }
}
