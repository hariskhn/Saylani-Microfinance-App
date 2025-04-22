import { isValidObjectId } from "mongoose";
import { Loan } from "../models/loan.model.js"


const fetchAllApplications = async (req, res) => {
    try {
        const applications = await Loan.find()
            .populate('user', 'name') // Populate user details
            .populate('guarantors', 'name email cnic location') // Populate guarantor details
            .lean();
            
        return res.status(200).json({ 
            applications, 
            message: "Applications fetched successfully" 
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({ message: error.message });
    }
}

const updateApplicationStatus = async (req, res) => {
    try {
        const { loanId } = req.params;
        const { status } = req.body;
    
        if (!loanId) {
            return res.status(400).json({ message: "Loan ID is required" });
        } else if (!isValidObjectId(loanId)) {
            return res.status(400).json({ message: "Invalid loan ID" });
        }
        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }
    
        loan.status = status;
        await loan.save();
    
        return res.status(200).json({ message: "Application status updated successfully" });
    } catch (error) {
        console.error("Error updating application status:", error);
        return res.status(500).json({ message: error.message });
    }
}

export {
    fetchAllApplications,
    updateApplicationStatus
}