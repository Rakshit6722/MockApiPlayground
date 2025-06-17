import mongoose from "mongoose";
import { boolean, required } from "zod/v4-mini";

const mockAuthSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    endpoint: {
        type: String,
        required: true
    },
    fields: [
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String, 
                required: true,
            },
            required: {
                type: Boolean,
                default: false,
            },

        }
    ]
}, {
    timestamps: true
})

export const MockAuth = mongoose.models.MockAuth || mongoose.model('MockAuth', mockAuthSchema)