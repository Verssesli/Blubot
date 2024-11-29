import {Client, Collection, GatewayIntentBits, Partials} from "discord.js";
import {SlashCommand} from "../../../types/SlashCommand";

// Extend Client class and add 'commands' collection
export class CustomClient extends Client {
  public commands: Collection<string, SlashCommand>;

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds],
      partials: [Partials.Channel]
    });
    this.commands = new Collection();
  }
}
