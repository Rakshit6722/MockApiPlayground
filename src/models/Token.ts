import mongoose from "mongoose";
import { required } from "zod/v4-mini";

const BlackListTokenSchema = new mongoose.Schema({
    jti: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
})

BlackListTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
)

export const BlackListToken = mongoose.models.BlackListToken ||
    mongoose.model("BlackListToken", BlackListTokenSchema);