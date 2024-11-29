import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder
} from "discord.js";
import {CustomClient} from "../src/support/discord/clientManager";

// Define the Command interface
export interface SlashCommand {
  data: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction, client: CustomClient) => void;
  autocomplete: (interaction: AutocompleteInteraction, client: CustomClient) => void;
}

