import mongoose, { Schema } from "mongoose"

export const Birthday = new Schema({
    userId: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
}, {collection: 'dates'})

export const BirthdayModel = mongoose.model('birthday', Birthday, 'dates')