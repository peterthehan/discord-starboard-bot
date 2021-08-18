module.exports = class Starboard {
  constructor(messageReaction, user) {
    this.messageReaction = messageReaction;
    this.user = user;
    this.emoji = messageReaction.emoji.id || messageReaction.emoji.name;
    this.message = messageReaction.message;
    this.client = user.client;
    this.rule = null;
  }

  validateInput() {
    if (
      this.message.system ||
      this.user.bot ||
      this.user.system ||
      this.message.channel.type === "DM" ||
      !(this.message.guild.id in this.client.starboardRules)
    ) {
      return false;
    }

    const rules = this.client.starboardRules[this.message.guild.id];
    const { rule } = rules.find((rule) => rule.emojis.has(this.emoji)) || {
      rule: false,
    };
    this.rule = rule;

    return Boolean(this.rule);
  }

  handleVote() {
    if (this.rule.votePolicy === "public") {
      return;
    }

    if (this.rule.votePolicy === "private") {
      if (!this.messageReaction.users.cache.has(this.client.user.id)) {
        this.message.react(this.emoji);
      }

      this.messageReaction.users.remove(this.user);
      return;
    }

    if (this.rule.votePolicy === "hidden") {
      this.messageReaction.users.remove(this.user);
      return;
    }
  }

  validateRules() {
    return (
      (this.rule.ignore.rules &&
        (this.validateOverrides(this.rule.upvote) ||
          this.validateOverrides(this.rule.downvote))) ||
      !(
        (this.rule.ignore.nsfw && this.message.channel.nsfw) ||
        (this.rule.ignore.self && this.message.author === this.user) ||
        (this.rule.ignore.botMessage && this.message.author.bot) ||
        this.rule.ignore.channelIds.includes(this.message.channel.id)
      )
    );
  }

  validateOverrides(voteType) {
    const memberRoles =
      this.message.guild.members.resolve(this.user.id).roles.cache || new Map();

    return (
      voteType.overrideEmojis.includes(this.emoji) &&
      (voteType.overrideUserIds.includes(this.user.id) ||
        voteType.overrideRoleIds.some((roleId) => memberRoles.has(roleId)))
    );
  }

  validateEmoji(voteType) {
    return voteType.emojis.includes(this.emoji);
  }

  validateCache(messageCache) {
    const key = this.message.id;

    if (!messageCache.has(key)) {
      messageCache.createMessage(key);
    }

    if (messageCache.isStarred(key)) {
      return false;
    }

    if (this.validateOverrides(this.rule.upvote)) {
      messageCache.clearMessage(key);
      return true;
    }

    if (this.validateOverrides(this.rule.downvote)) {
      messageCache.clearMessage(key);
      return false;
    }

    if (this.validateEmoji(this.rule.upvote)) {
      messageCache.addToUpvoteUsers(key, this.user.id);
    } else if (this.validateEmoji(this.rule.downvote)) {
      messageCache.addToDownvoteUsers(key, this.user.id);
    }

    const isValid =
      messageCache.getNetVotes(key) >= this.rule.reactionThreshold;
    if (isValid) {
      messageCache.clearMessage(key);
    }

    return isValid;
  }

  async getWebhook() {
    const channel = await this.client.channels.fetch(this.rule.channelId);
    const webhooks = await channel.fetchWebhooks();

    return !webhooks.size
      ? channel.createWebhook(this.client.user.username)
      : webhooks.first();
  }

  getImages() {
    const embeds = [
      ...this.message.attachments.map(({ url }) => ({ image: { url } })),
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
      this.rule.embed.renderJumpLink
        ? ` [[${this.rule.embed.jumpText}]](${this.message.url})`
        : ""
    }`;

    embeds[0] = {
      ...embeds[0],
      description,
      url: this.message.url,
      timestamp: this.message.createdAt,
      color: this.rule.embed.color,
      footer: {
        text: this.rule.embed.footerText,
        icon_url: this.message.author.displayAvatarURL(),
      },
    };

    return embeds;
  }

  async sendWebhook() {
    const webhook = await this.getWebhook();
    const embeds = this.createEmbeds();
    const webhookOptions = {
      username: this.message.guild.members.resolve(this.client.user.id)
        .displayName,
      avatarURL: this.client.user.displayAvatarURL(),
    };

    webhook.send({ embeds, ...webhookOptions });
  }

  async sendPinnedIndicatorMessage() {
    if (!this.rule.pinnedIndicator.message) {
      return;
    }

    if (this.rule.pinnedIndicator.pingUser) {
      return this.message.channel.send(
        this.rule.pinnedIndicator.message
          .replace(/\{1\}/g, this.message.author)
          .replace(/\{2\}/g, `<#${this.rule.channelId}>`)
      );
    }

    const nonMentionable = `\`@${this.message.author.tag}\``;

    const newMessage = await this.message.channel.send(
      this.rule.pinnedIndicator.message
        .replace(/\{1\}/g, nonMentionable)
        .replace(/\{2\}/g, `<#${this.rule.channelId}>`)
    );
    newMessage.edit(
      newMessage.content.replace(
        new RegExp(nonMentionable, "gi"),
        this.message.author
      )
    );
  }
};
