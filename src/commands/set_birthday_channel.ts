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
        },
        {
            name: 'birthday_ping',
            description: 'Birthday Role (optional (defaults to the user))',
            type: ApplicationCommandOptionType.Role,
            required: false
        }
    ]
}

export function run({ interaction, client, handler }: SlashCommandProps) {
    if (!interaction.guild) return;
    const channel = interaction.options.getChannel('channel')
    if (!channel) return
    let role = interaction.options.getRole('birthday_ping')
    ChannelModel.collection.updateOne({
        guildId: interaction.guild.id
    }, {
        "$set": {
            birthdayRole: role?.id,
            channelId: channel.id
        }
    }, {upsert: true}).then(() => {
        interaction.reply({
            content: role ? 'Birthday channel and role set!' : 'Birthday channel set!',
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