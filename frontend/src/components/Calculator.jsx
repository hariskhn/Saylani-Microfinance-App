import { useState } from "react";
import { loanCategories } from "../loanCategories";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const Calculator = () => {
  const { signup } = useUserStore();

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [loanPeriod, setLoanPeriod] = useState("");
  const [amountRequested, AmountRequested] = useState(0);
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnic, setCnic] = useState("");

  const navigate = useNavigate();

  const handleCalculate = () => {
    if (!category || !subCategory || !loanPeriod || !initialDeposit) return toast.error("All Fields are required!");
    const maxLoan = loanCategories[category].maxLoan;
    const deposit = parseFloat(initialDeposit) || 0;
    const period = parseInt(loanPeriod) || 0;
    const allowedPeriod = Math.min(period, loanCategories[category].maxPeriod);
    const loan = Math.min(maxLoan - deposit, maxLoan);
    const monthly = loan / (allowedPeriod * 12);
    AmountRequested(loan);
    setMonthlyInstallment(monthly.toFixed(2));
  };

  const handleSubmitApplication = async () => {
    if (isLoading) return;
  
    setIsLoading(true);
  
    try {
      let user = await signup({ name, email, cnic });
  
      if (user) {
        localStorage.setItem('loan', JSON.stringify({ category, subCategory, amountRequested, loanPeriod, initialDeposit }));
        toast.success("Application submitted!\nCheck your email, including the spam folder.", {
          duration: 5000,
        });      
        setShowModal(false);
        setName("");
        setEmail("");
        setCnic("");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-3xl shadow-2xl space-y-6 animate-fade-in mb-20 bg-white">
      <h2 className="text-4xl font-extrabold text-center text-blue-600">Loan Calculator</h2>

      {/* form section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
              setLoanPeriod("");
            }}
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {Object.keys(loanCategories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sub-category */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Sub-category</label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            disabled={!category}
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            <option value="">{category ? "Select Sub-category" : "Select a category first"}</option>
            {category && loanCategories[category].subcategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Initial Deposit */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Initial Deposit</label>
          <input
            type="number"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value.replace(/^0+(?!$)/, ""))}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter deposit amount"
          />
        </div>

        {/* Loan Period */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Loan Period (Years)</label>
          <input
            type="number"
            value={loanPeriod}
            onChange={(e) => {
              const value = Math.min(parseInt(e.target.value) || 0, loanCategories[category]?.maxPeriod);
              setLoanPeriod(value);
            }}
            min="1"
            max={loanCategories[category]?.maxPeriod}
            className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={!category ? `Max years` : `Max ${loanCategories[category]?.maxPeriod} years`}
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full py-3 mt-4 bg-blue-600 cursor-pointer text-white font-semibold rounded-full transition duration-200 hover:scale-102"
      >
        Calculate
      </button>

      {/* Results */}
      {amountRequested > 0 && (
        <div className="flex items-center flex-col">
          <div className="mt-6 p-6 bg-gray-100 border w-full border-gray-300 rounded-2xl shadow-inner text-center space-y-2 text-blue-800">
            <p className="text-xl font-bold">Loan Amount: <span className="text-green-600">PKR {amountRequested.toLocaleString()}</span></p>
            <p className="text-xl font-bold">Monthly Installment: <span className="text-green-600">PKR {monthlyInstallment}</span></p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-10 mt-4 text-lg bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-full transition duration-200 hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            Proceed
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-6 text-blue-600 text-center">Submit Your Application</h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="CNIC"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSubmitApplication}
                className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
