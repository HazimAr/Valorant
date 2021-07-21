// const Command = require("../../structures/Command"),
//   { MessageEmbed } = require("discord.js"),
//   { NANO_PREFIX } = process.env;
// module.exports = class GuildPrefix extends Command {
//   constructor(client) {
//     super(client, {
//       name: "prefix",
//       aliases: [
//         "guild-prefix",
//         "gp",
//         "sp",
//         "server-prefix",
//         "g-prefix",
//         "guild-p",
//         "server-p",
//         "change-prefix",
//       ],
//       group: "guild",
//       memberName: "prefix",
//       description: "Change your guild's prefix.",
//       examples: [`${NANO_PREFIX}prefix %`],
//       args: [
//         {
//           key: "prefix",
//           prompt: "What should the guild prefix be?",
//           type: "string",
//           default: "",
//           validate: (text) => {
//             if (text.length < 10) {
//               return true;
//             }
//             return "Prefixes must be 10 characters or less";
//           },
//         },
//       ],
//       throttling: {
//         usages: 1,
//         duration: 10,
//       },
//       userPermissions: ["MANAGE_MESSAGES"],
//       ownerOnly: false,
//       guildOnly: true,
//       argsPromptLimit: 0,
//     });
//   }

//   async run(msg, { prefix }) {
//     if (!prefix) {
//       let getGuild_prefix;

//       try {
//         getGuild_prefix = await this.client.MySQL.getGuildPrefix(msg.guild.id);
//       } catch {
//         return msg.reply(
//           `Your guild doesn't have a guild prefix yet; Mods can set one like this: \`${NANO_PREFIX}prefix %\``
//         );
//       }

//       const prefixEmbed = new MessageEmbed()
//         .setThumbnail("https://i.imgur.com/ImR1hBJ.gif")
//         .setColor("#40FAFF")
//         .addField(
//           `${msg.guild.name} Prefix`,
//           `Your current prefix is: ${getGuild_prefix}`,
//           false
//         )
//         .setFooter(`Mods can change this prefix with ${getGuild_prefix}prefix`);
//       return msg.embed(prefixEmbed);
//     }

//     if (prefix) {
//       try {
//         await this.client.MySQL.setGuildPrefix(msg.guild.id, prefix);
//       } catch {
//         null;
//       }
//       let guild_Prefix;
//       try {
//         guild_Prefix = await this.client.MySQL.getGuildPrefix(msg.guild.id);
//       } catch {
//         return msg.say(
//           "I couldn't seem to get your guild's prefix. Contact the support server for help."
//         );
//       }

//       const prefixEmbed = new MessageEmbed()
//         .setThumbnail("https://i.imgur.com/ImR1hBJ.gif")
//         .setColor("#40FAFF")
//         .addField(
//           `${msg.guild.name} Prefix`,
//           `Your current prefix is: ${guild_Prefix}`,
//           false
//         )
//         .setFooter(`Mods can change this prefix with ${guild_Prefix}prefix`);
//       return msg.channel.send(prefixEmbed);
//     }
//   }
// };
