import React, { useEffect, useState } from "react";
import {
    FiCheckCircle, FiClock, FiXCircle, FiEye, FiCalendar,
    FiMapPin, FiX, FiDollarSign, FiUser,
    FiCalendar as FiDate, FiHome, FiSearch, FiList
} from "react-icons/fi";
import { useApplicationStore } from "../stores/useApplicationStore";
import LoanDetailsView from "../components/LoanDetailsView";

const AdminDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    // New states for scheduling
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [scheduleLocation, setScheduleLocation] = useState("");

    const { fetchAllApplications, scheduleApplicationAppointment } = useApplicationStore();

    const statusConfig = {
        approved: {
            icon: <FiCheckCircle className="mr-1" />,
            bg: "bg-green-50",
            text: "text-green-700"
        },
        pending: {
            icon: <FiClock className="mr-1" />,
            bg: "bg-yellow-50",
            text: "text-yellow-700"
        },
        rejected: {
            icon: <FiXCircle className="mr-1" />,
            bg: "bg-red-50",
            text: "text-red-700"
        }
    };

    useEffect(() => {
        const getApplications = async () => {
            try {
                const allApplications = await fetchAllApplications();
                setApplications(allApplications);
                setFilteredApplications(allApplications);
            } catch (error) {
                console.log(error);
            }
        };
        getApplications();
    }, [approveModalOpen]);

    useEffect(() => {
        const results = applications.filter((app) => {
            const matchesName = app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = app.category?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesName || matchesCategory;
        });
        setFilteredApplications(results);
    }, [searchTerm, applications]);

    const handleApproveClick = (app) => {
        setSelectedApp(app);
        setScheduleDate(""); // reset form values
        setScheduleTime("");
        setScheduleLocation("");
        setApproveModalOpen(true);
    };

    const handleViewClick = (app) => {
        setSelectedApp(app);
        setViewModalOpen(true);
    };

    const confirmApproval = async () => {
        if (!selectedApp) return;
        try {
            await scheduleApplicationAppointment({
                loanID: selectedApp._id,
                date: scheduleDate,
                timeSlot: scheduleTime,
                officeLocation: scheduleLocation
            });
            setApproveModalOpen(false);
        } catch (error) {
            console.error("Approval scheduling failed", error);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-center mb-8">
                <FiHome className="text-blue-600 text-3xl mr-3" />
                <h1 className="text-3xl font-extrabold text-gray-800">Loan Applications Dashboard</h1>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <FiUser className="mr-2" /> User
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <FiList className="mr-2" /> Category
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <FiDollarSign className="mr-2" /> Loan Amount
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    <FiDate className="mr-2" /> Loan Period
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredApplications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            {app.user?.name?.charAt(0) || "A"}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {app.user?.name || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.category || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    Rs. {app.amountRequested?.toLocaleString() || "0"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {app.loanPeriod} {app.loanPeriod > 1 ? "years" : "year"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[app.status]?.bg || "bg-gray-50"} ${statusConfig[app.status]?.text || "text-gray-700"}`}>
                                        {statusConfig[app.status]?.icon || <FiClock className="mr-1" />}
                                        {app.status?.charAt(0)?.toUpperCase() + app.status?.slice(1) || "Pending"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewClick(app)}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center transition-colors"
                                        >
                                            <FiEye className="mr-1" /> View
                                        </button>
                                        <button
                                            onClick={() => handleApproveClick(app)}
                                            disabled={app.status !== "pending"}
                                            className={`px-3 py-1 rounded-md flex items-center transition-colors ${app.status !== "pending"
                                                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                        >
                                            <FiCalendar className="mr-1" /> Approve & Schedule
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {viewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur bg-black/20 overflow-y-auto py-10">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl p-6 relative">
                        <button
                            onClick={() => setViewModalOpen(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
                        >
                            <FiX size={24} />
                        </button>
                        <LoanDetailsView loan={selectedApp} />
                    </div>
                </div>
            )}

            {/* Approve & Schedule Modal */}
            {approveModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FiCalendar className="mr-2 text-blue-600" />
                                    Approve & Schedule
                                </h2>
                                <button
                                    onClick={() => setApproveModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FiCalendar className="mr-2" />
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FiClock className="mr-2" />
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                        <FiMapPin className="mr-2" />
                                        Office Location
                                    </label>
                                    <select
                                        value={scheduleLocation}
                                        onChange={(e) => setScheduleLocation(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select location</option>
                                        <option value="karachi">Karachi Main Branch</option>
                                        <option value="lahore">Lahore Office</option>
                                        <option value="islamabad">Islamabad HQ</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setApproveModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmApproval}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    Confirm Approval
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;