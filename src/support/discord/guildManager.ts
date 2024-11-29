import { Client, Guild } from "discord.js";
import {initDB, g_checkDB, g_addDB} from "../db/dbFunctions";
import {cascadeDeleteGuild} from "../db/cascadeDeletes";

export async function initializeGuilds(client: Client) {
  const guilds = client.guilds.cache.map(guild => guild);

  if (guilds.length === 0) {
    console.log("Bot is not part of any servers!")
    return;
  }

  await initDB()
  for (const guild of guilds) {
    try {
      if (!await g_checkDB(guild.id)) await g_addDB(guild)
    } catch (e) {
      console.log("Could not initialize guilds: " + e)
      return;
    }
  }
  console.log("Initialized Guilds.")
}

export async function addGuild(guild: Guild) {
  try {
    await g_addDB(guild)
  } catch (e) {
    console.log("Could not add guild to database: " + e)
  }
}

export async function remGuild(guildID: string) {
  try {
    await cascadeDeleteGuild(guildID)
  } catch (e) {
    console.log("Could not remove guild from database: " + e)
  }
}
