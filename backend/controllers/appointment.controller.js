import { Appointment } from "../models/appointment.model.js";
import { Loan } from "../models/loan.model.js";
import { TokenNum } from "../models/tokenNum.model.js";
import QRCode from "qrcode";

const generateTokenNumber = async () => {
    let tokenmodel = await TokenNum.findOneAndUpdate(
        { name: "Appointment Number" },
        { $inc: { tokenNum: 1 } },
        { new: true, upsert: true }
    );

    return `TK-${String(tokenmodel.tokenNum).padStart(3, '0')}`;
}

const generateQRCode = async ({ tokenNumber, date, timeSlot, officeLocation }) => {
    const qrData = JSON.stringify({
        tokenNumber,
        date,
        timeSlot,
        officeLocation
    });

    return await QRCode.toDataURL(qrData);
};

const scheduleAppointment = async (req, res) => {
    try {
        const { loanId } = req.params;
        const { date, timeSlot, officeLocation } = req.body;

        if (!loanId) {
            return res.status(400).json({ message: "Loan ID is required" });
        } else if (!isValidObjectId(loanId)) {
            return res.status(400).json({ message: "Invalid loan ID" });
        }
        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        if (!date || !timeSlot || !officeLocation) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const tokenNumber = await generateTokenNumber();
        const qrCode = await generateQRCode({ tokenNumber, date, timeSlot, officeLocation });

        const appointment = await Appointment.create({
            loan: loanId,
            date,
            timeSlot,
            tokenNumber,
            officeLocation,
            qrCode
        });

        return res.status(201).json({ appointment, message: "Appointment scheduled successfully" });
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        return res.status(500).json({ message: error.message });
    }
}

const fetchAnAppointment = async (req, res) => {
    try {
        const { loanId } = req.params;

        if (!loanId) {
            return res.status(400).json({ message: "Loan ID is required" });
        } else if (!isValidObjectId(loanId)) {
            return res.status(400).json({ message: "Invalid loan ID" });
        }
        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        const appointment = await Appointment.findOne({ loan: loanId }).lean();
        if (!appointment) {
            return res.status(404).json({ message: "No appointment found for this loan" });
        }

        return res.status(200).json({ appointment, message: "Appointment fetched successfully" });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        return res.status(500).json({ message: error.message });
    }
}

const fetchAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().lean();
        return res.status(200).json({ appointments, message: "Appointments fetched successfully" });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return res.status(500).json({ message: error.message });
    }
}

export {
    scheduleAppointment,
    fetchAnAppointment,
    fetchAllAppointments
}