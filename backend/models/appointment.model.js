import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
    loan: {
        type: Schema.Types.ObjectId,
        ref: "Loan"
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    tokenNumber: {
        type: String,
        required: true
    },
    officeLocation: {
        type: String,
        required: true
    },
    qrCode: {
        type: String
    }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema); 