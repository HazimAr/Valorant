const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  lobbies: {
    type: Object,
  },
  giveaways: {
    type: Object,
  },
});

const guildModel = model("guild", guildSchema);

const createGuild = async (guildId, name) => {
  const guild = {
    _id: guildId,
    name,
    prefix: "v!",
  };
  //
  let guildDocument = new guildModel(guild);
  guildDocument = await guildDocument.save();
  return guildDocument;
};

module.exports = {
  MongoGuild: guildModel,
  createGuild,
};

// {

//     231523653476346: {
//         author: "421353246346",
//         main: "231523653476346",
//         attackers: "24121424124213",
//         defenders: "27634574568568",
//     }

// }
