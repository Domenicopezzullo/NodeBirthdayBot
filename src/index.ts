import 'dotenv/config';

import { Colors, EmbedBuilder } from 'discord.js'
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
  
    let embed = new EmbedBuilder()
      .setTitle("It's someone's birthday today!")
      .setDescription(`It's ${birthday.userName}'s birthday today!\nWish him a happy birthday!`)
      .setColor(Colors.Blue)
      .setImage("https://i.pinimg.com/originals/cc/89/4b/cc894b8ade894d5acd0a4060ec8de4a9.gif")


    if (channelToFetch) {
      if (!channelToFetch.channelId) return
  
      const channelId = channelToFetch.channelId.toString();
      const guild = await client.guilds.fetch(birthday.guildId);
      const user = await guild.members.fetch(birthday.userId);
      const channelToSend = await guild.channels.fetch(channelId) as TextChannel;
      let roleId = channelToFetch.birthdayRole;
      if (!roleId) {channelToSend.send({
        content: `<@${user.id}>`, embeds: [embed]})
      } else {
        const role = await guild.roles.fetch(roleId)
        if(!role) return
        if (channelToSend) {
          // channelToSend.send(`Happy Birthday ${user.displayName}!`);
          channelToSend.send({content: `<@&${role.id}>`, embeds: [embed]})
        }
      }
    }
  }); 
}

check_birthdays()
setInterval(check_birthdays, 360000);

client.login(process.env.TOKEN);
