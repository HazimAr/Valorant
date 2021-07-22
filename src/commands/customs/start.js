const Commando = require("discord.js-commando");

module.exports = class StartCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "start",
      group: "custom game",
      memberName: "start",
      description:
        "Will start a custom game, Randomize Teams, Randomize Map, and drag everyone to their respected voice channel",
      guildOnly: true,
    });
  }

  async run(message) {
    if (!message.guild)
      return message.say(
        ":warning: **This command can only be used in a server!**"
      );

    const user = message.guild.members.cache.get(message.author.id);
    const channel = user.voice.channel;

    if (!channel) {
      return message.say(
        "Please join a voice channel before running this command"
      );
    }

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

    const players = channel.members
      .map((member) => {
        return member.user;
      })
      .sort(() => Math.random() - 0.5);
    // if (players.length <= 2) {
    //   return message.say(
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

    message.say(`Attacking: ${attacking.join(", ")}
Defending: ${defending.join(", ")}

Players will be moved to their respective voice channels`);

    const attackingChannel = message.guild.channels.cache.get(game.attacking);
    attacking.forEach(async (attacker) => {
      // console.log(attacker);
      attacker = await message.guild.members.cache.get(attacker.id);
      attacker.voice.setChannel(attackingChannel);
    });

    const defendingChannel = message.guild.channels.cache.get(game.defending);
    defending.forEach(async (defender) => {
      defender = await message.guild.members.cache.get(defender.id);
      defender.voice.setChannel(defendingChannel);
    });
  }
};
