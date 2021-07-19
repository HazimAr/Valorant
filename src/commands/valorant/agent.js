const Commando = require("discord.js-commando");

module.exports = class AgentCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: "agent",
      group: "valorant",
      memberName: "agent",
      description: "Chooses a random valorant agent",
    });
  }

  async run(message) {
    const agents = [
      "Astra",
      "Breach",
      "Brimstone",
      "Cypher",
      "Jett",
      "Kayo",
      "Killjoy",
      "Omen",
      "Phoenix",
      "Raze",
      "Reyna",
      "Sage",
      "Skye",
      "Sova",
      "Viper",
      "Yoru",
    ];
    message.say(agents[Math.floor(Math.random() * agents.length)]);
  }
};
