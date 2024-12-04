# Blubot

[![Discord Invite](https://img.shields.io/badge/Discord-Invite%20Blubot-7289DA?logo=discord&logoColor=white)](https://discord.com/oauth2/authorize?client_id=1298290046532718592)

Blubot is a Discord bot that relays posts, reposts, quote reposts, and replies from [Bluesky](https://bluesky.social/) to Discord.

## Table of Contents

- [Features](#features)
- [Invite Blubot](#invite-blubot-to-your-server)
- [Getting Started](#getting-started)
  - [Commands](#commands)
- [Self-Hosting](#self-hosting)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Configuration](#configuration)
  - [Running the Bot](#running-the-bot)
- [Contributing](#contributing)
- [License](#license)
- [Privacy Policy](#privacy-policy)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Features

- **Post Relay**: Automatically forwards new posts from Bluesky to specified Discord channels. Supported post types:
  - `Posts`
  - `Reposts`
  - `Quote Reposts`
  - `Replies`
- **Send as Webhook**: Send posts as a Discord webhook, which inherit the username and pfp of the account instead of the bot

## Invite Blubot to Your Server

You can invite Blubot to your Discord server by clicking the link below:

[Invite Blubot](https://discord.com/oauth2/authorize?client_id=1298290046532718592)

## Getting Started

Once Blubot is added to your server, you can start tracking Bluesky accounts and customize the bot's behavior using the following commands.

### Commands

#### `/bsky-add`

Add tracking for a Bluesky account.

**Usage:**

```plaintext
/bsky-add
```

**Options:**

- `account` (required): Search for an account or enter their entire handle.
- `channel` (required): Set the channel where posts will be relayed.
- `ping` (optional): Set a role to be pinged alongside each post.
- `fx` (optional): Fix embeds with [VixBluesky](https://github.com/Rapougnac/VixBluesky) (replace links with `bskyx.app`). Default: `false`.
- `wh` (optional): Send posts as a webhook (username and avatar will be the account's). Default: `false`.
- `rt` (optional): Send reposts. Default: `true`.
- `re` (optional): Send replies. Default: `true`.

**Example:**

```plaintext
/bsky-add account:example.bsky.social channel:#bluesky-updates ping:@BlueskyFans fx:true wh:false rt:true re:true
```

---

#### `/bsky-remove`

Remove tracking for a Bluesky account.

**Usage:**

```plaintext
/bsky-remove account:<account>
```

**Options:**

- `account` (required): Enter the account to stop tracking.

**Example:**

```plaintext
/bsky-remove account:example.bsky.social
```

---

#### `/bsky-settings`

Check and change settings for a tracked Bluesky account.

**Usage:**

```plaintext
/bsky-settings account:<account>
```

**Options:**

- `account` (required): Enter the account to view or modify settings.

**Example:**

```plaintext
/bsky-settings account:example.bsky.social
```

---

**Note:** These commands require the user to have the `Moderate Members` permission.

## Self-Hosting

If you'd like to host Blubot yourself, follow the steps below.

### Prerequisites

- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
- **Git**: Install Git from [git-scm.com](https://git-scm.com/).

### Installation Steps

1. **Clone the Repository**

   Open your terminal and run:

   ```bash
   git clone https://github.com/Verssesli/BluBot.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd blubot
   ```

3. **Install Dependencies**

   Install the required Node.js packages:

   ```bash
   npm install
   ```

4. **Compile TypeScript**

   ```bash
   npm run build
   ```

### Configuration

1. **Copy the Environment Configuration**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. **Set Up Environment Variables**

   Open `.env` in a text editor and provide your Discord bot's credentials:

   - `DISCORD_TOKEN`: Your Discord bot token.
   - `BOT_ID`: Your Discord bot's client ID.

   Make sure to save the file after editing.

### Running the Bot

Start the bot by running:

```bash
node .
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements, or open an issue if you find any problems.

## License

This project is licensed under the [MIT License](LICENSE).

## Privacy Policy

*(Privacy policy details to be added.)*

## Contact

For questions or support, please contact [your contact information here].

## Acknowledgements
Blubot is possible thanks to the work of these wonderful groups:
- [Bluesky](https://bluesky.social/)
- [discord.js](https://discord.js.org/)
- [Discord](https://discord.com/) 
