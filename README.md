# Discord Starboard Bot

[![Discord](https://discordapp.com/api/guilds/258167954913361930/embed.png)](https://discord.gg/WjEFnzC) [![Twitter Follow](https://img.shields.io/twitter/follow/peterthehan.svg?style=social)](https://twitter.com/peterthehan) [![Ko-fi](https://img.shields.io/badge/Donate-Ko--fi-F16061.svg?logo=ko-fi)](https://ko-fi.com/peterthehan) [![Patreon](https://img.shields.io/badge/Donate-Patreon-F96854.svg?logo=patreon)](https://www.patreon.com/peterthehan)

A Discord bot that allows for the democratic pinning of messages.

<div align="center">
  <img src="https://raw.githubusercontent.com/peterthehan/assets/master/repositories/discord-starboard-bot/starboard.gif" />
</div>

## Setup

1. Follow the instructions in [create-discord-bot](https://github.com/peterthehan/create-discord-bot).

> Don't forget to give your bot the `Manage Webhooks` permission!

2. Download this widget and add it into the [src/widgets](https://github.com/peterthehan/create-discord-bot/tree/master/app/src/widgets) folder.

3. Open [config.json](https://github.com/peterthehan/discord-starboard-bot/blob/master/config.json) to configure your own settings:

```js
[
  {
    "guildId": "GUILD_ID",
    "channelId": "CHANNEL_1_ID",
    "reactionThreshold": 5,
    "upvote": {
      "emojis": ["⭐", "⬆️"],
      "overrideEmojis": ["🌟"],
      "overrideUserIds": ["USER_1_ID", "USER_2_ID"]
    },
    "downvote": {
      "emojis": ["⬇️"],
      "overrideEmojis": ["⛔"],
      "overrideUserIds": ["USER_1_ID"]
    },
    "embed": {
      "color": "ffac33",
      "footerText": "Starboard",
      "jumpText": "link",
      "renderJumpLink": true
    },
    "ignore": {
      "nsfw": false,
      "self": true,
      "botMessage": false,
      "channelIds": ["CHANNEL_2_ID"]
    }
  },
  // ...Add as many rules as you want.
]
```

> You can have multiple starboards in one server! Simply add more rule objects inside the `config.json` file. The only requirement is that **all** the `emojis` between each rule **must** be unique.

- `guildId` is the server you wish to enable starboard for.
- `channelId` is the text channel you wish to be the starboard.
- `reactionThreshold` is the number of reactions needed before the message gets pinned.
- `upvote`/`downvote`

  - `emojis` are the reaction emojis the bot tracks. The message gets pinned when the count difference between upvotes and downvotes is greater than or equal to the `reactionThreshold`.
  - `overrideEmojis` are the reaction emojis that automatically pins the message (`upvote`) or prevents the pinning of the message (`downvote`) no matter what the count was at.
  - `overrideUserIds` are the users who can use `overrideEmojis`.

    > Leave `downvote`'s array options empty `[]` if you wish to not use the downvote logic.

    > Override logic does **not** bypass all the other rules defined in `ignore`, **only** the threshold requirement.

  - An emoji can be:

    - A unicode emoji. https://emojipedia.org is a good reference to copy and paste from.

      ```js
      "😳", "🥺", // etc
      ```

    - An emoji id for custom emojis. You can get a custom emoji's ID by sending `\:YourCustomEmoji:` in chat (prefix a backslash `\` character in front of your desired emoji).

      ```js
      "716344914706694165", "622635442013208589", // etc
      ```

- `embed`

  - `color` is the color of the embed.
  - `footerText` is the text rendered at the footer of the embed.
  - `jumpText` is the hyperlink text rendered to jump to the message.
  - `renderJumpLink` determines whether the hyperlink text renders (`true`) or not (`false`).

- `ignore`

  - `nsfw` determines whether the bot ignores NSFW channels (`true`) or not (`false`).
  - `self` determines whether the bot ignores reactions made by the message's author (`true`) or not (`false`).
  - `botMessage` determines whether the bot ignores bot messages (`true`) or not (`false`).
  - `channelIds` are the text channels the bot ignores.

4. `npm start` to run the bot.

Visit for more help or information!

<a href="https://discord.gg/WjEFnzC">
  <img src="https://discordapp.com/api/guilds/258167954913361930/embed.png?style=banner2" title="Discord Server"/>
</a>
