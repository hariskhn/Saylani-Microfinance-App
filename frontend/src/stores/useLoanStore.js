import { create } from 'zustand'
import axios from "../lib/axios"

export const useLoanStore = create((set, get) => ({
    loan: null,

    createLoan: ({ category, subCategory, amountRequested, loanPeriod, initialDeposit }) => {
        set({ loan: { category, subCategory, amountRequested, loanPeriod, initialDeposit } });
        console.log(get().loan);
    },

    saveLoanInDB: async () => {
        try {
            console.log(get().loan);
            const res = await axios.post("/loan", get().loan);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    },

    fetchAUsersLoans: async () => {
        try {
            const res = await axios.get("/loan");
            console.log(res.data);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    },

    fetchALoan: async ({ loanID }) => {
        try {
            const res = await axios.get(`/loan/${loanID}`);
            console.log(res.data);
            // return res.data;
        } catch (error) {
            console.error(error);
        }
    },

    updateLoanRequest: async ({ loanID, guarantors, statementImg, salarySheetImg }) => {
        try {
            const res = await axios.patch(`/loan/${loanID}`, {guarantors, statementImg, salarySheetImg});
            console.log(res.data);
        } catch (error) {
            console.error(error)
        }
    }

}))