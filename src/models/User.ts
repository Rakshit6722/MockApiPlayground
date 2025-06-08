import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken:{
        type: String,
        default: null,
    },
    resetTokenExpiration: {
        type: Date,
        default: null,
    },
})

export const User = mongoose.models.User || mongoose.model("User", UserSchema);