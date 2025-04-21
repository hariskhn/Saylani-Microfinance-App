import React, { useEffect, useState } from 'react';
import { useLoanStore } from '../stores/useLoanStore';
import { useUserStore } from '../stores/useUserStore';
import LoanDetailsModal from '../components/LoanDetailsModal';
import { FiDollarSign, FiCalendar, FiChevronRight, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useUserStore();
  const { fetchAUsersLoans } = useLoanStore();

  const [loans, setLoans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLoans = async () => {
      setIsLoading(true);
      try {
        const userLoans = await fetchAUsersLoans();
        setLoans(userLoans);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getLoans();
  }, []);

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      approved: { icon: <FiCheckCircle className="mr-1" />, bg: 'bg-green-50', text: 'text-green-700' },
      pending: { icon: <FiClock className="mr-1" />, bg: 'bg-yellow-50', text: 'text-yellow-700' },
      rejected: { icon: <FiXCircle className="mr-1" />, bg: 'bg-red-50', text: 'text-red-700' }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
        {config.icon}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome, {user.name}!</h1>
        </div>

        {/* Loan Applications Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Loan Applications</h2>
            <span className="text-sm text-gray-500">
              {loans.length} {loans.length === 1 ? 'application' : 'applications'}
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiDollarSign className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No applications yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You haven't submitted any loan applications. Get started by applying for a new loan.
              </p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Apply for Loan
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan, index) => (
                <div
                  key={loan._id}
                  className="group border border-gray-200 hover:border-blue-200 rounded-lg p-5 transition-all hover:shadow-md cursor-pointer"
                  onClick={() => handleViewDetails(loan)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <FiDollarSign className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {loan.category} - {loan.subCategory}
                          </h3>
                          <p className="text-sm text-gray-500">Applied on {new Date(loan.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="ml-12 space-y-1">
                        <p className="text-sm">
                          <span className="text-gray-500">Amount:</span>{' '}
                          <span className="font-medium">Rs. {loan.amountRequested?.toLocaleString()}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Period:</span>{' '}
                          <span className="font-medium">{loan.loanPeriod} {loan.loanPeriod > 1 ? "years" : "year"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <StatusBadge status={loan.status} />
                      <button className="mt-3 text-blue-600 flex items-center text-sm font-medium group-hover:text-blue-700 transition">
                        View details <FiChevronRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loan Details Modal */}
      {showModal && (
        <LoanDetailsModal
          loan={selectedLoan}
          onClose={() => {
            setShowModal(false);
            setSelectedLoan(null);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;