import { create } from 'zustand'
import axios from "../lib/axios"

export const useApplicationStore = create((set, get) => ({
    fetchAllApplications: async () => {
        try {
            const res = await axios.get("/applications");
            return res.data.applications;
        } catch (error) {
            console.log(error)
        }
    },

    scheduleApplicationAppointment: async ({ loanID, date, timeSlot, officeLocation }) => {
        try {
            const res = await axios.post(`/appointment/${loanID}`, { date, timeSlot, officeLocation });
            console.log(res.data)
        } catch (error) {
            console.error(error);
        }
    },

    fetchAnApplicationAppointment: async({ loanID }) => {
        try {
            const res = await axios.get(`/appointment/${loanID}`);
            console.log(res.data)
            return res.data.appointment;
        } catch (error) {
            console.error(error);
        }
    }
}))