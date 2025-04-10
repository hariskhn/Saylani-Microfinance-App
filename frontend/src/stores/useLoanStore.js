import { create } from 'zustand'
import axios from "../lib/axios"

export const useLoanStore = create((set, get) => ({
    loan: null,

    createLoan: ({ category, subCategory, amountRequested, loanPeriod, initialDeposit }) => {
        set({ loan: { category, subCategory, amountRequested, loanPeriod, initialDeposit }});
        console.log(get().loan);
    },

    saveLoanInDB: async() => {
        try {
            console.log(get().loan);
            const res = await axios.post("/loan", get().loan);
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    }
}))