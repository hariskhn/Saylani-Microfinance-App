import React, { useState } from 'react';
import { useLoanStore } from '../stores/useLoanStore';
import { FiUser, FiMail, FiMapPin, FiCreditCard, FiDollarSign, FiUpload, FiPaperclip, FiCheck } from 'react-icons/fi';

const LoanDetailsForm = ({ loan, onClose }) => {
  const [guarantor1, setGuarantor1] = useState({ name: '', email: '', location: '', cnic: '' });
  const [guarantor2, setGuarantor2] = useState({ name: '', email: '', location: '', cnic: '' });
  const [statementImg, setStatementImg] = useState(null);
  const [salarySheetImg, setSalarySheetImg] = useState(null);

  const { updateLoanRequest } = useLoanStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [guarantor, field] = name.split(".");

    if (guarantor === "guarantor1") {
      setGuarantor1((prev) => ({ ...prev, [field]: value }));
    } else if (guarantor === "guarantor2") {
      setGuarantor2((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "statement") {
      setStatementImg(files[0]);
    } else if (name === "salarySheet") {
      setSalarySheetImg(files[0]);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async () => {
    const guarantors = [guarantor1, guarantor2];

    // Convert optional files to base64
    const statementBase64 = statementImg ? await toBase64(statementImg) : null;
    const salaryBase64 = salarySheetImg ? await toBase64(salarySheetImg) : null;

    await updateLoanRequest({
      loanID: loan._id,
      guarantors,
      statementImg: statementBase64,
      salarySheetImg: salaryBase64,
    });

    onClose(); // Close modal
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-3 text-blue-600 flex items-center justify-center gap-2">
          <FiCreditCard className="text-blue-500" />
          Complete Your Application
        </h2>
        <p className="text-gray-500 mt-1">Please provide guarantor details and supporting documents</p>
      </div>

      <div className="space-y-6">
        {/* Guarantor 1 */}
        <div className='p-2'>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
            <FiUser className="text-blue-500" />
            Guarantor 1 Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="guarantor1.name"
                  value={guarantor1.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="guarantor1.email"
                  value={guarantor1.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">Location</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="guarantor1.location"
                  value={guarantor1.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">CNIC</label>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="guarantor1.cnic"
                  value={guarantor1.cnic}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Guarantor 2 */}
        <div className='p-2'>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
            <FiUser className="text-blue-500" />
            Guarantor 2 Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="guarantor2.name"
                  value={guarantor2.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="guarantor2.email"
                  value={guarantor2.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">Location</label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="guarantor2.location"
                  value={guarantor2.location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-500 mb-1">CNIC</label>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="guarantor2.cnic"
                  value={guarantor2.cnic}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="space-y-4">
          {/* Statement Upload */}
          <div className='p-2'>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiDollarSign className="text-blue-500" />
              Bank Statement (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                name="statement"
                id="statement"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <label
                htmlFor="statement"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
              >
                <FiUpload />
                Choose File
              </label>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                {statementImg ? (
                  <>
                    <FiPaperclip />
                    {statementImg.name}
                  </>
                ) : (
                  "No file chosen"
                )}
              </span>
            </div>
          </div>

          {/* Salary Sheet Upload */}
          <div className='p-2'>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiDollarSign className="text-blue-500" />
              Salary Slip (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                name="salarySheet"
                id="salarySheet"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <label
                htmlFor="salarySheet"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center gap-2"
              >
                <FiUpload />
                Choose File
              </label>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                {salarySheetImg ? (
                  <>
                    <FiPaperclip />
                    {salarySheetImg.name}
                  </>
                ) : (
                  "No file chosen"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer mt-4 flex items-center justify-center gap-2"
        >
          <FiCheck />
          Submit Application
        </button>
      </div>
    </>
  );
};

export default LoanDetailsForm;