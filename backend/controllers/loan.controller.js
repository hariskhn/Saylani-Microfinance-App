import { isValidObjectId } from "mongoose";
import { Loan } from "../models/loan.model.js";
import { Guarantor } from "../models/guarantor.model.js";
import cloudinary from "../utils/cloudinary.js";


const createLoanRequest = async (req, res) => {
    const { category, subCategory, amountRequested, loanPeriod, initialDeposit } = req.body;

    const loan = await Loan.create({
        user: req.user._id,
        category,
        subCategory,
        amountRequested,
        loanPeriod,
        initialDeposit
    });

    return res.status(201).json({ loan, message: "Loan created successfully" });
}

const getAllLoanRequests = async (req, res) => {
    try {
        const user = req.user;

        let loanRequests = await Loan.find({ user })
            .select("category subCategory amountRequested loanPeriod initialDeposit status allInfoGiven guarantors createdAt")
            .lean();

        for (const loan of loanRequests) {
            if (loan.guarantors && loan.guarantors.length > 0) {
                const guarantors = await Guarantor.find({
                    _id: { $in: loan.guarantors }
                }).lean();
                loan.guarantors = guarantors;
            } else {
                loan.guarantors = [];
            }
        }

        return res.status(200).json(loanRequests);
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
            .select("category subCategory amountRequested loanPeriod initialDeposit guarantors status")
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
        const { guarantors, statementImg, salarySheetImg } = req.body;
        let statementImgResult;
        let salarySheetImgResult;

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
            const newGuarantor = new Guarantor({ loan: loanId, ...g });
            await newGuarantor.save();
            guarantorIds.push(newGuarantor._id);
        }

        if (statementImg) {
            statementImgResult = await cloudinary.uploader.upload(statementImg, {
                folder: 'SMIT'
            });
        }

        if (salarySheetImg) {
            salarySheetImgResult = await cloudinary.uploader.upload(salarySheetImg, {
                folder: 'SMIT'
            });
        }

        loan.guarantors = guarantorIds;
        loan.statementUrl = statementImgResult.secure_url || loan.statementUrl;
        loan.salarySheetUrl = salarySheetImgResult.secure_url || loan.salarySheetUrl;
        loan.allInfoGiven = true;
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
    createLoanRequest,
    getAllLoanRequests,
    getLoanRequestById,
    updateLoanRequest,
    deleteLoanRequest
};