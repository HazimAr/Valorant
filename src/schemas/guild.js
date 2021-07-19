const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
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
  lobbyID: {
    type: String,
  },
  
});
