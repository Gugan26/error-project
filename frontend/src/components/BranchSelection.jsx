import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmployeeDetails } from "./EmployeeDetails";
import { Building2, ArrowRight, Globe, MapPin } from "lucide-react";

export default function App() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const branchList = [
    "VDart Gcc, Trichy",
    "VDart Digital, Bangalore",
    "VDart Digital, Chennai",
    "VDart, US Atlanta",
  ];

  const popularLocations = ["Trichy", "Bangalore", "Chennai"];

  const handleEnterDashboard = (branchName) => {
    const finalBranch = branchName || inputValue;
    if (finalBranch) {
      setSelectedBranch(finalBranch);
      setInputValue(finalBranch); // 🔥 sync dropdown value
    }
  };

  return (
    <div className="min-h-screen bg-bg font-sans text-text">
      <AnimatePresence mode="wait">
        {!selectedBranch ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
            {/* HEADER */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-12 text-center"
            >
              <div className="inline-block p-6 rounded-full shadow-neu mb-6 bg-bg text-neu-blue">
                <Globe size={48} className="animate-pulse" />
              </div>
              <h1 className="text-5xl font-extrabold text-gray-700 tracking-tight">
                VDart
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Global Parking Management System
              </p>
            </motion.div>

            {/* CARD */}
            <motion.div className="w-full max-w-md p-8 rounded-3xl shadow-neu bg-bg">
              <label className="block text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                Select Your Branch
              </label>

              {/* DROPDOWN */}
              <div className="relative mb-6">
                <select
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-4 pl-6 rounded-xl bg-bg shadow-inner focus:ring-2 focus:ring-neu-blue outline-none text-gray-700 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Choose from list...
                  </option>
                  {branchList.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-5 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>

              {/* QUICK ACCESS */}
              <div className="mb-8">
                <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest text-center">
                  Quick Access
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularLocations.map((loc) => {
                    const fullBranch = branchList.find((b) =>
                      b.includes(loc)
                    );
                    return (
                      <button
                        key={loc}
                        onClick={() => handleEnterDashboard(fullBranch)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-bg shadow-neu hover:text-neu-blue transition-all border border-transparent hover:border-neu-blue/30 text-gray-500"
                      >
                        <MapPin size={12} /> {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => handleEnterDashboard()}
                disabled={!inputValue}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-neu active:shadow-inner ${
                  inputValue
                    ? "bg-neu-blue text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                Access Dashboard <ArrowRight size={20} />
              </button>
            </motion.div>

            <footer className="mt-12 text-gray-400 text-sm italic">
              Connected to {branchList.length} operational hubs.
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="min-h-screen"
          >
            {/* DASHBOARD HEADER */}
            <div className="bg-bg shadow-md p-4 flex justify-between items-center px-8 border-b border-gray-100">
              <div className="flex items-center gap-2 text-neu-blue font-bold">
                <Building2 size={18} />
                {selectedBranch.toUpperCase()}
              </div>
              <button
                onClick={() => {
                  setSelectedBranch(null);
                  setInputValue("");
                }}
                className="text-xs text-red-400 hover:underline font-medium px-4 py-2 rounded-lg shadow-neu active:shadow-inner"
              >
                Switch Branch
              </button>
            </div>

            {/* EMPLOYEE DETAILS */}
            <EmployeeDetails branchName={selectedBranch} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
