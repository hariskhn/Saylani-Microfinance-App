import mongoose, { Schema } from "mongoose";

const tokenNumSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tokenNum: {
        type: Number,
        default: 0
    }
});

export const TokenNum = mongoose.model("TokenNum", tokenNumSchema); 