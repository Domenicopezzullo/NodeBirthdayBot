import 'dotenv/config';


import { Client, IntentsBitField, TextChannel } from 'discord.js';
import { CommandKit } from 'commandkit';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { ChannelModel } from './schemas/Channel';
import { BirthdayModel } from './schemas/Birthday';

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
} else {
  console.error("MONGODB_URI is not defined")
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

new CommandKit({
  client,
  eventsPath: join(__dirname, 'events'),
  commandsPath: join(__dirname, 'commands'),
});

export async function check_birthdays() {
  let monthnumber = new Date().getUTCMonth()+1
  let monthstring = monthnumber.toString().padStart(2, '0')
  let day = new Date().getUTCDate().toString().padStart(2, '0')
  let date = `${day}/${monthstring}`
  
  let birthdays = await BirthdayModel.find({birthday: date})
  
  birthdays.forEach(async (birthday) => {
    const channelToFetch = await ChannelModel.findOne({ guildId: birthday.guildId });
  
    if (channelToFetch) {
      if (!channelToFetch.channelId) return
  
      const channelId = channelToFetch.channelId.toString();
      const guild = await client.guilds.fetch(birthday.guildId);
      const user = await guild.members.fetch(birthday.userId);
      const channelToSend = await guild.channels.fetch(channelId) as TextChannel;
  
      if (channelToSend) {
        channelToSend.send(`Happy Birthday ${user.displayName}!`);
      }
    }
  }); 
}


client.login(process.env.TOKEN);
