import { create } from 'zustand'
import axios from "../lib/axios"

export const useUserStore = create((set, get) => ({
    user: null,

    signup: async ({ name, email, cnic }) => {
        try {
            const res = await axios.post("/user/signup", { name, email, cnic });
        } catch (error) {
            console.error(error);
        }
    },

    login: async ({ email, password }) => {
        try {
            const res = await axios.post("/user/login", { email, password });
            set({ user: res.data.loggedInUser });
            console.log(get().user);
        } catch (error) {
            console.error(error);
        }
    },

    changePassword: async ({ password, confirmPassword }) => {
        try {
            const res = await axios.patch("/user/forgot-password", { password, confirmPassword });
            set({ user: res.data.updatedUser });
        } catch (error) {
            console.error(error);
        }
    }
}))