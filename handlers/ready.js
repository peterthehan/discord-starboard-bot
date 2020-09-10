const rules = require("../config");

module.exports = async (client) => {
  console.log("starboard: ready");

  client.starboardRules = {};
  rules.forEach((rule) => {
    const ruleKey = `${rule.guildId}-${rule.emoji}`;
    client.starboardRules[ruleKey] = rule;
  });
};
