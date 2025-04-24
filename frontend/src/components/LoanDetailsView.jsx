import React from 'react';
import { FiDollarSign, FiCreditCard, FiUsers, FiMail, FiMapPin, FiUser } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import { useApplicationStore } from '../stores/useApplicationStore';

const LoanDetailsView = ({ loan, user }) => {
    if (!loan) return null;

    const statusColors = {
        approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
        rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        default: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    };

    const statusConfig = statusColors[loan.status?.toLowerCase()] || statusColors.default;

    const {fetchAnApplicationAppointment} = useApplicationStore();

    const handleDownloadSlip = async (loan) => {
        const doc = new jsPDF();
        const appointment = await fetchAnApplicationAppointment({ loanID: loan._id });
    
        const token = appointment?.tokenNumber;
        const appointmentDate = new Date(appointment?.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const appointmentTime = appointment?.timeSlot;
        const location = appointment?.officeLocation;
        const qrCodeUrl = appointment?.qrCode;
    
        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Loan Appointment Slip', 105, 20, null, null, 'center');
    
        // Line separator
        doc.setDrawColor(0);
        doc.line(20, 25, 190, 25);
    
        // Appointment details
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        let y = 40;
        doc.text(`Token Number: ${token}`, 20, y);
        y += 10;
        doc.text(`Appointment Date: ${appointmentDate}`, 20, y);
        y += 10;
        doc.text(`Appointment Time: ${appointmentTime}`, 20, y);
        y += 10;
        doc.text(`Office Location: ${location}`, 20, y);
    
        // QR Code
        if (qrCodeUrl) {
            doc.addImage(qrCodeUrl, 'PNG', 20, y + 20, 60, 60);
        }
    
        doc.save(`${token}_Slip.pdf`);
    };
      

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Loan Application Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Loan Information Cards */}
                <div className={`bg-white p-4 rounded-xl border ${statusConfig.border} shadow-sm`}>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FiCreditCard className="text-blue-500" />
                        Loan Information
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Category</span>
                            <span className="font-medium">{loan.category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subcategory</span>
                            <span className="font-medium">{loan.subCategory}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                                {loan.status}
                            </span>
                        </div>
                        {loan.status?.toLowerCase() === 'approved' && user==="user" && (
                            <div className="mt-4 text-right">
                                <button
                                    onClick={() => handleDownloadSlip(loan)}
                                    className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-md hover:bg-blue-700 transition"
                                >
                                    Download Slip
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FiDollarSign className="text-green-500" />
                        Financial Details
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Amount Requested</span>
                            <span className="font-medium">Rs. {loan.amountRequested?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Loan Period</span>
                            <span className="font-medium">{loan.loanPeriod} {loan.loanPeriod > 1 ? "years" : "year"}</span>
                        </div>
                        {loan.initialDeposit && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Initial Deposit</span>
                                <span className="font-medium">Rs. {loan.initialDeposit?.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Guarantors Section */}
            {loan?.guarantors?.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FiUsers className="text-purple-500" />
                        Guarantors ({loan.guarantors.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loan.guarantors.map((guarantor, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <FiUser className="text-blue-500" />
                                    </div>
                                    <h4 className="font-medium">{guarantor.name}</h4>
                                </div>
                                <div className="space-y-1 text-sm pl-12">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiMail size={14} />
                                        <span>{guarantor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiMapPin size={14} />
                                        <span>{guarantor.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="font-medium">CNIC:</span>
                                        <span>{guarantor.cnic}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Documents Section (if applicable) */}
            {(loan.documents || loan.attachments) && (
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-3">Supporting Documents</h3>
                    <div className="flex flex-wrap gap-2">
                        {/* Render document previews or download links here */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanDetailsView;