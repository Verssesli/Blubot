import {SlashCommand} from "../../../types/SlashCommand";
import {REST, Routes} from "discord.js";
import {BskyRemove, BskyAdd, BskySettings} from "../../core/commands/index";
import {CustomClient} from "./clientManager";

export async function loadCommands(client: CustomClient) {
  const commands = [
    new BskyAdd() as SlashCommand,
    new BskyRemove() as SlashCommand,
    new BskySettings() as SlashCommand,
    ]
  for (const command of commands){
    client.commands.set(command.data.name, command);
  }
}

export async function pushCommandsToDiscord(client: CustomClient) {
  if (!client.commands) return
  const commands = client.commands.map((command) => command.data.toJSON())

  if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) throw new Error("Discord Token or client ID is not set.")
  const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN)

  rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
}
