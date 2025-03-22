import mongoose, { Schema } from "mongoose";

const guarantorSchema = new Schema({
    loan: {
        type: Schema.Types.ObjectId,
        ref: "Loan"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cnic: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Guarantor = mongoose.model("Guarantor", guarantorSchema);