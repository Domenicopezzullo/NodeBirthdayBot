import { CommandData, SlashCommandProps, CommandOptions } from "commandkit";
import { ApplicationCommandOptionType, MessageFlags } from "discord.js";
import mongoose from 'mongoose'
import { BirthdayModel } from "../schemas/Birthday";

export const data: CommandData = {
    name: 'add_birthday',
    description: 'Add your birthday!',
    options: [
        {
            name: 'birthday',
            description: 'Your birthday (dd/mm)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ]
}

export async function run({ interaction, client, handler }: SlashCommandProps) {
    if (!interaction.guild) return;
    const birthday = interaction.options.getString('birthday')
    BirthdayModel.collection.updateOne({
        userId: interaction.user.id
    }, {
        $set: {
            userName: interaction.user.displayName,
            userId: interaction.user.id,
            birthday: birthday,
            guildId: interaction.guild.id
        }}, {upsert: true}).then(() => {
        interaction.reply({
            content: 'Birthday added!',
            flags: MessageFlags.Ephemeral
        })
    }).catch((err) => {
        interaction.reply({
            content: 'Error: ' + err,
            flags: MessageFlags.Ephemeral
        })
    })
}