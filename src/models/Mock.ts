import mongoose from "mongoose";

const MockSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    route:{
        type: String,
        required: true
    },
    method:{
        type: String,
        default: 'GET',
    },
    response:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status:{
        type: Number,
        default: 200
    },
    isArray:{
        type: Boolean,
        default: false
    },
    keyField:{
        type: String,
        default: 'id'
    }
},{
    timestamps: true,
})

export const Mock = mongoose.models.Mock || mongoose.model('Mock', MockSchema);