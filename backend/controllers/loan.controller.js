import { isValidObjectId } from "mongoose";
import { Loan } from "../models/loan.model.js";
import { Guarantor } from "../models/guarantor.model.js";


// const createLoanRequest = async (req, res) => {
// to be created with frontend
// }

const getAllLoanRequests = async (req, res) => {
    try {
        const user = req.user;

        const loanRequests = await Loan.find({ user })
            .select("category subCategory amountRequested loanPeriod initialDeposit status")
            .lean();

        return res.status(200).json({ loanRequests, message: "All loan fetched successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getLoanRequestById = async (req, res) => {
    try {
        const { loanId } = req.params;

        if (!loanId) {
            return res.status(400).json({ message: "Loan ID is required" });
        } else if (!isValidObjectId(loanId)) {
            return res.status(400).json({ message: "Invalid loan ID" });
        }

        const loanRequest = await Loan.findById(loanId)
            .select("category subCategory amountRequested loanPeriod initialDeposit status")
            .lean();

        if (!loanRequest) {
            return res.status(404).json({ message: "Loan not found" });
        }

        return res.status(200).json({ loanRequest, message: "Loan fetched successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateLoanRequest = async (req, res) => {
    try {
        const { loanId } = req.params;
        const { guarantors, statementUrl, salarySheetUrl } = req.body;

        if (!loanId) {
            return res.status(400).json({ message: "Loan ID is required" });
        } else if (!isValidObjectId(loanId)) {
            return res.status(400).json({ message: "Invalid loan ID" });
        }

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        if (!Array.isArray(guarantors) || guarantors.length !== 2) {
            return res.status(400).json({ message: "Exactly 2 guarantors are required" });
        }

        const guarantorIds = [];
        for (const g of guarantors) {
            const newGuarantor = new Guarantor(g);
            await newGuarantor.save();
            guarantorIds.push(newGuarantor._id);
        }

        loan.guarantors = guarantorIds;
        loan.statementUrl = statementUrl || loan.statementUrl;
        loan.salarySheetUrl = salarySheetUrl || loan.salarySheetUrl;
        await loan.save();

        return res.status(200).json({ message: "Loan request updated successfully", loan });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteLoanRequest = async (req, res) => {
    try {
        const { loanId } = req.params;

        if (!loanId) {
            return res.status(400).json({ message: "Loan ID is required" });
        } else if (!isValidObjectId(loanId)) {
            return res.status(400).json({ message: "Invalid loan ID" });
        }

        Loan.findByIdAndDelete(loanId);

        return res.status(200).json({ message: "Loan deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAllLoanRequests,
    getLoanRequestById,
    updateLoanRequest,
    deleteLoanRequest
};