const MessageCache = require("../classes/MessageCache");
const Starboard = require("../classes/Starboard");

const messageCache = new MessageCache();

module.exports = async (messageReaction, user) => {
  const starboard = new Starboard(messageReaction, user);
  if (!starboard.validateInput()) {
    return;
  }

  starboard.handleVote();

  if (!starboard.validateRules() || !starboard.validateCache(messageCache)) {
    return;
  }

  starboard.sendWebhook();
  starboard.sendPinnedIndicatorMessage();
};
