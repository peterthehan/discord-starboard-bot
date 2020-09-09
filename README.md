# Discord Starboard Bot

[![Discord](https://discordapp.com/api/guilds/258167954913361930/embed.png)](https://discord.gg/WjEFnzC) [![Twitter Follow](https://img.shields.io/twitter/follow/peterthehan.svg?style=social)](https://twitter.com/peterthehan) [![Ko-fi](https://img.shields.io/badge/Donate-Ko--fi-F16061.svg?logo=ko-fi)](https://ko-fi.com/peterthehan) [![Patreon](https://img.shields.io/badge/Donate-Patreon-F96854.svg?logo=patreon)](https://www.patreon.com/peterthehan)

A Discord bot that allows for the democratic pinning of messages.

## Setup

1. Follow the instructions in [create-discord-bot](https://github.com/peterthehan/create-discord-bot).

> Don't forget to give your bot the `Manage Webhooks` permission!

2. Download this widget and add it into the [src/widgets](https://github.com/peterthehan/create-discord-bot/tree/master/app/src/widgets) folder.

3. Open [config.json](https://github.com/peterthehan/discord-starboard-bot/blob/master/config.json) to configure your own settings:

```js
[
  {
    "reactionThreshold": 5,
    "color": "ffac33",
    "footerText": "Starboard",
    "jumpText": "link",
    "renderJumpLink": true,
    "emoji": "⭐",
    "ignoreNsfw": false,
    "ignoreSelf": true,
    "ignoreBotMessage": false,
    "ignoreChannelIds": ["CHANNEL_1_ID", "CHANNEL_2_ID"],
    "guildId": "GUILD_ID",
    "webhook": {
      "id": "WEBHOOK_ID",
      "token": "WEBHOOK_TOKEN"
    }
  },
  // ...Add as many rules as you want.
]
```

- `reactionThreshold` is the number of reactions needed before the message gets pinned.
- `color` is the color of the embed.
- `footerText` is the text rendered at the footer of the embed.
- `jumpText` is the hyperlink text rendered to jump to the message.
- `renderJumpLink` determines whether the hyperlink text renders (`true`) or not (`false`).
- `emoji` can be:

  - A unicode emoji. https://emojipedia.org is a good reference to copy and paste from.

    ```js
    "emoji": "😳"
    ```

  - An emoji id for custom emojis. You can get a custom emoji's ID by sending `\:YourCustomEmoji:` in chat (prefix a backslash `\` character in front of your desired emoji).

    ```js
    "emoji": "716344914706694165"
    ```

- `ignoreNsfw` determines whether the bot ignores NSFW channels (`true`) or not (`false`).
- `ignoreSelf` determines whether the bot ignores reactions made by the message's author (`true`) or not (`false`).
- `ignoreBotMessage` determines whether the bot ignores bot messages (`true`) or not (`false`).
- `ignoreChannelIds` are the text channels the bot ignores.
- `guildId` is the guild you wish to enable starboard for.
- `webhook.id` is the `WEBHOOK_ID` portion of the webhook URL: `https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN`
- `webhook.token` is the `WEBHOOK_TOKEN` portion of the webhook URL: `https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN`

Visit for more help or information!

<a href="https://discord.gg/WjEFnzC">
  <img src="https://discordapp.com/api/guilds/258167954913361930/embed.png?style=banner2" title="Discord Server"/>
</a>
