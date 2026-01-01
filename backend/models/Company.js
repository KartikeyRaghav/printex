// server/models/Company.js

import { Schema, model } from 'mongoose';

const CompanySchema = new Schema({
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    members: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    subscription: {
        plan: { 
            type: String, 
            enum: ['monthly', 'half_yearly', 'yearly', 'none'], 
            default: 'none' 
        },
        expiryDate: { type: Date }
    }
}, { timestamps: true });

export default model('Company', CompanySchema);