const { WebhookClient } = require("discord.js");

const messageCache = {};

class Starboard {
  constructor(messageReaction, user) {
    this.emoji = messageReaction.emoji;
    this.message = messageReaction.message;
    this.user = user;
    this.rule = null;
  }

  validateRule() {
    if (
      this.message.system ||
      this.user.bot ||
      this.user.system ||
      this.message.channel.type !== "text" ||
      !(this.message.guild.id in this.user.client.starboardRules)
    ) {
      return false;
    }

    this.rule = this.user.client.starboardRules[this.message.guild.id];

    return !(
      this.rule.emoji !== (this.emoji.id || this.emoji.name) ||
      (this.rule.ignoreNsfw && this.message.channel.nsfw) ||
      (this.rule.ignoreSelf && this.message.author === this.user) ||
      (this.rule.ignoreBotMessage && this.message.author.bot) ||
      this.rule.ignoreChannelIds.includes(this.message.channel.id)
    );
  }

  validateCache(cache) {
    if (!(this.message.id in cache)) {
      cache[this.message.id] = { starred: false, users: new Set() };
    }

    if (cache[this.message.id].starred) {
      return false;
    }

    cache[this.message.id].users.add(this.user.id);

    const isValid =
      this.rule.thresholdOverrideUserIds.includes(this.user.id) ||
      cache[this.message.id].users.size >= this.rule.reactionThreshold;
    if (isValid) {
      cache[this.message.id].starred = true;
      cache[this.message.id].users.clear();
    }

    return isValid;
  }

  getImages() {
    const embeds = [
      ...this.message.attachments
        .array()
        .map(({ url }) => ({ image: { url } })),
      ...this.message.embeds,
    ]
      .slice(0, 4)
      .map(({ image }) => ({ image, url: this.message.url }));

    return embeds.length ? embeds : [{}];
  }

  createEmbeds() {
    const embeds = this.getImages();
    const description = `${this.message.author} | ${this.message.channel}\n${
      this.message.content
    }${
      this.rule.renderJumpLink
        ? ` [[${this.rule.jumpText}]](${this.message.url})`
        : ""
    }`;

    embeds[0] = {
      ...embeds[0],
      description,
      url: this.message.url,
      timestamp: this.message.createdAt,
      color: this.rule.color,
      footer: {
        text: this.rule.footerText,
        icon_url: this.message.author.displayAvatarURL(),
      },
    };

    return embeds;
  }

  sendWebhook() {
    const webhook = new WebhookClient(
      this.rule.webhook.id,
      this.rule.webhook.token
    );
    const embeds = this.createEmbeds();
    const webhookOptions = {
      username: this.message.guild.members.resolve(this.message.client.user.id)
        .displayName,
      avatarURL: this.message.client.user.displayAvatarURL(),
    };

    webhook.send({ embeds, ...webhookOptions });
  }
}

module.exports = async (messageReaction, user) => {
  const starboard = new Starboard(messageReaction, user);
  if (!starboard.validateRule() || !starboard.validateCache(messageCache)) {
    return;
  }

  starboard.sendWebhook();
};
