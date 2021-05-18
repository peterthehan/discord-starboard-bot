const rules = require("../config");

module.exports = async (client) => {
  console.log("starboard: ready");

  client.starboardRules = {};
  rules.forEach((rule) => {
    if (!(rule.guildId in client.starboardRules)) {
      client.starboardRules[rule.guildId] = [];
    }

    client.starboardRules[rule.guildId].push({
      emojis: new Set([
        ...rule.upvote.emojis,
        ...rule.upvote.overrideEmojis,
        ...rule.downvote.emojis,
        ...rule.downvote.overrideEmojis,
      ]),
      rule,
    });
  });
};
