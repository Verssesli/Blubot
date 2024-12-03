import {Interaction} from "discord.js";
import {CustomClient} from "../../support/discord/clientManager";
import {handleChannelSelectMenu, handleRoleSelectMenu, handleStringSelectMenu} from "./componentHandler";

export async function handleInteraction(interaction: Interaction, client: CustomClient): Promise<void> {
  if (!interaction.isCommand() && !interaction.isAutocomplete() && !interaction.isButton() && !interaction.isModalSubmit() && !interaction.isStringSelectMenu() && !interaction.isRoleSelectMenu() && !interaction.isChannelSelectMenu()) return;

  if (interaction.isButton() || interaction.isModalSubmit() || interaction.isUserSelectMenu() || interaction.isMentionableSelectMenu()){
    return;
  }
  else if (interaction.isStringSelectMenu()) {
    await handleStringSelectMenu(interaction)
  }
  else if (interaction.isRoleSelectMenu()) {
    await handleRoleSelectMenu(interaction)
  }
  else if (interaction.isChannelSelectMenu()) {
    await handleChannelSelectMenu(interaction)
  }
  else {
    const command = client.commands.get(interaction.commandName)
    if (!command) return;

    if (interaction.isAutocomplete()){
      command.autocomplete(interaction, client)
    }
    else if (interaction.isChatInputCommand()) (
      command.execute(interaction, client)
    )
  }
}
