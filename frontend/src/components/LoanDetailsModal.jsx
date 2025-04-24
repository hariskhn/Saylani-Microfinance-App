import React from 'react';
import LoanDetailsView from './LoanDetailsView';
import LoanDetailsForm from './LoanDetailsForm';
import { FiX } from 'react-icons/fi';

const LoanDetailsModal = ({ loan, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur bg-black/20 overflow-y-auto py-10">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl p-6 m-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
        >
          <FiX size={24} />
        </button>

        {loan.allInfoGiven ? (
          <LoanDetailsView loan={loan} user={"user"} />
        ) : (
          <LoanDetailsForm loan={loan} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default LoanDetailsModal;