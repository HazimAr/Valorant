const Commando = require("discord.js-commando");

module.exports = class MapCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "map",
      group: "valorant",
      memberName: "map",
      description: "Chooses a random valorant map",
    });
  }

  async run(message) {
    const map = ["Ascent‎", "Bind", "Haven", "Split", "Icebox", "Breeze"];
    message.say(map[Math.floor(Math.random() * map.length)]);
  }
};
