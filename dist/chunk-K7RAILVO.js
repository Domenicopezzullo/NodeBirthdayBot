/* Optimized production build generated by CommandKit */

// src/schemas/Birthday.ts
import mongoose, { Schema } from "mongoose";
var Birthday = new Schema({
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
  }
}, { collection: "dates" });
var BirthdayModel = mongoose.model("birthday", Birthday, "dates");

export {
  Birthday,
  BirthdayModel
};
