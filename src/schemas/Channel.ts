import mongoose, { Schema } from "mongoose"

export const Channel = new Schema({
    guildId: String,
    channelId: String
}, {collection: 'channels'})

export const ChannelModel = mongoose.model('channel', Channel, 'channels')