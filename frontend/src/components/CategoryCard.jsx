import React from 'react';
import { loanCategories } from '../loanCategories';

const formatLoanAmount = (amount) => {
  if (!isFinite(amount)) return "As per requirement";
  return `PKR ${amount.toLocaleString()}`;
};

const formatPeriod = (years) => {
  return `${years} year${years > 1 ? "s" : ""}`;
};

const CategoryCards = () => {
  const categories = Object.entries(loanCategories).map(([name, data]) => ({
    name,
    ...data
  }));

  return (
    <section className="py-20 px-6" id="loan-categories">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 leading-tight">
          Find the Right Loan for You
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="group relative rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden transition-transform transform hover:scale-[1.03]"
            >
              <div className="p-6 pb-3 pt-4 bg-blue-600 mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {`${cat.name} Loans`}
                </h3>
              </div>

              <div className="relative z-10 p-6 pb-4 pt-0">
                <div className="text-md text-gray-600 mb-3">
                  <p>
                    <span className="font-semibold">Max Loan:</span>{" "}
                    {formatLoanAmount(cat.maxLoan)}
                  </p>
                  <p>
                    <span className="font-semibold">Period:</span>{" "}
                    {formatPeriod(cat.maxPeriod)}
                  </p>
                </div>

                <div className="text-gray-500 font-medium mt-4">
                  <p className="mb-1 text-gray-700 text-md">Subcategories:</p>
                  <ul className="list-inside space-y-1 list-none text-sm">
                    {cat.subcategories.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
