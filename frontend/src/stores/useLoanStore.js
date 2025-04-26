import { create } from 'zustand';
import axios from "../lib/axios";
import toast from 'react-hot-toast';

export const useLoanStore = create((set, get) => ({
    saveLoanInDB: async ({ category, subCategory, amountRequested, loanPeriod, initialDeposit }) => {
        try {
            const res = await axios.post("/loan", { category, subCategory, amountRequested, loanPeriod, initialDeposit });
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
          const res = await axios.patch(`/loan/${loanID}`, { guarantors, statementImg, salarySheetImg });
          console.log(res.data);
          return res.data.loan;
        } catch (error) {
          console.error(error);
          if (error.response?.data?.message?.includes("E11000 duplicate key error")) {
            const duplicateField = error.response.data.message.includes("email") ? "Email" : "CNIC";
            toast.error(`${duplicateField} already exists. Please use a different one.`);
          } else {
            toast.error(error.response?.data?.message || "An error occurred");
          }
        }
      }
      

}))