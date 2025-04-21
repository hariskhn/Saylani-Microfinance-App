import mongoose, { Schema } from "mongoose";

const loanSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum: ["Wedding", "Home Construction", "Business Startup", "Education"],
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    amountRequested: {
        type: Number,
        required: true
    },
    loanPeriod: {
        type: Number,
        required: true
    },
    initialDeposit: {
        type: Number,
        required: true
    },
    guarantors: [{
        type: Schema.Types.ObjectId,
        ref: "Guarantor"
    }],
    statementUrl: {
        type: String,
        default: null
    },  
    salarySheetUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    allInfoGiven: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Loan = mongoose.model("Loan", loanSchema);