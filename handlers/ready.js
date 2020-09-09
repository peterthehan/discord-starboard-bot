const rules = require("../config");

module.exports = async (client) => {
  console.log("starboard: ready");

  client.starboardRules = {};
  rules.forEach((rule) => (client.starboardRules[rule.guildId] = rule));
};
