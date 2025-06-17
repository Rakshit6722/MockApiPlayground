import mongoose from "mongoose";

const mockUserDataSchema = new mongoose.Schema({
    mockAuthId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MockAuth",
        required: true
    },
    email:{
        type: String,
        required: true,
    },  
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { strict: false });

export const MockUserData = mongoose.models.MockUserData || mongoose.model('MockUserData', mockUserDataSchema);