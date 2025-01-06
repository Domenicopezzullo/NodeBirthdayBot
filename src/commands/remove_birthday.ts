import {SlashCommandProps, CommandData, CommandOptions} from 'commandkit'
import { BirthdayModel } from '../schemas/Birthday'
import { MessageFlags } from 'discord.js';

export const data: CommandData = {
    name: 'remove_birthday',
    description: 'Remove your birthday!',
}

export function run({ interaction, client, handler }: SlashCommandProps) {
    if (!interaction.guild) return;

    BirthdayModel.collection.deleteOne({
        userId: interaction.user.id,
    }).then(() => {
        interaction.reply({
            content: 'Birthday removed!',
            flags: MessageFlags.Ephemeral
        })
    }).catch((err) => {
        interaction.reply({
            content: 'Error: ' + err,
            flags: MessageFlags.Ephemeral
        })
    })
}