import {SlashCommandProps, CommandData, CommandOptions} from 'commandkit'
import { ApplicationCommandOptionType, MessageFlags } from 'discord.js';
import { Channel, ChannelModel } from '../schemas/Channel'

export const data: CommandData = {
    name: 'set_birthday_channel',
    description: 'Set the birthday channel! (Admins only)',
    options: [
        {
            name: 'channel',
            description: 'Channel ID',
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ]
}

export function run({ interaction, client, handler }: SlashCommandProps) {
    if (!interaction.guild) return;
    const channel = interaction.options.getChannel('channel')
    if (!channel) return

    ChannelModel.collection.updateOne({
        guildId: interaction.guild.id
    }, {
        "$set": {
            channelId: channel.id
        }
    }, {upsert: true}).then(() => {
        interaction.reply({
            content: 'Birthday channel set to ' + channel.name,
            flags: MessageFlags.Ephemeral
        })
    }).catch((err) => {
        interaction.reply({
            content: 'Error: ' + err,
            flags: MessageFlags.Ephemeral
        })
    })
}

export const options: CommandOptions = {
    userPermissions: ['Administrator'],
    botPermissions: 'SendMessages'
}