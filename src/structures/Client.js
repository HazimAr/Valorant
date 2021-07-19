const { CommandoClient } = require("discord.js-commando");
const Mongo = require("./Mongo.js");
const { MongoGuild, createGuild } = require("../schemas/guild.js");

module.exports = class Valorant extends CommandoClient {
  constructor(options) {
    super(options);
    this.Mongo = {
      new: new Mongo(this),
      MongoGuild,
      getOrMakeGuild: async (id) => {
        let guild = await MongoGuild.findOne({ _id: id });
        if (!guild) {
          const g = await this.guilds.fetch(id);
          guild = new MongoGuild(await createGuild(id, g.name));
        }
        return guild;
      },
      //   MongoUser,
      //   getOrMakeUser: async (id, tag) => {
      //     let user = await MongoUser.findOne({ _id: id });
      //     if (!user) user = new MongoUser(await createUser(id, tag));
      //     return user;
      //   },
    };
  }
};
