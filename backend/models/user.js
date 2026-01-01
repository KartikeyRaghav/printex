// server/models/User.js

import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    // --- NEW FIELDS ---
    trialEndsAt: { 
        type: Date 
    },
    company: { 
        type: Schema.Types.ObjectId, 
        ref: 'Company' 
    }
}, { timestamps: true });

export default model('User', UserSchema);