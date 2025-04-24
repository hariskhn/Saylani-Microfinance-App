import { create } from 'zustand'
import axios from "../lib/axios"
import toast from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
    user: null,

    signup: async ({ name, email, cnic }) => {
        try {
            const res = await axios.post("/user/signup", { name, email, cnic });
            return res.data.newUser;
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    login: async ({ email, password }) => {
        try {
            const res = await axios.post("/user/login", { email, password });
            set({ user: res.data.loggedInUser });
            console.log(get().user);
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || "An error occurred")
        }
    },

    changePassword: async ({ password, confirmPassword }) => {
        try {
            const res = await axios.patch("/user/forgot-password", { password, confirmPassword });
            set({ user: res.data.updatedUser });
            return res.data.updatedUser;
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message || "An error occured");
        }
    },

    logout: async () => {
        try{
            await axios.post("/user/logout");
            set({ user: null});
        } catch (error) {
            console.error(error);
        }
    }
}))