import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Car, Clock, Calendar, ArrowLeft, CheckCircle, Hash } from "lucide-react";

export function MonthlyPassForm({ onBack }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    vehicle_number: "", 
    start_time: "",       
    end_time: "",       
    start_date: "",
    end_date: ""
});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ----------------------------
    // 1️⃣ Time Validation (Max 6 hours)
    // ----------------------------
    const [startH, startM] = formData.start_time.split(":").map(Number);
    const [endH, endM] = formData.end_time.split(":").map(Number);
    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = endH * 60 + endM;

    if (endTotalMinutes <= startTotalMinutes) {
      alert("End time must be after start time");
      return;
    }

    const durationHrs = (endTotalMinutes - startTotalMinutes) / 60;
    if (durationHrs > 6) {
      alert(`Daily slot cannot exceed 6 hours. Current: ${durationHrs.toFixed(1)} hrs`);
      return;
    }

    // ----------------------------
    // 2️⃣ Date Validation (Max 30 days)
    // ----------------------------
    const startD = new Date(formData.start_date);
    const endD = new Date(formData.end_date);

    if (endD < startD) {
      alert("End date cannot be before start date");
      return;
    }

    const diffDays = Math.ceil((endD - startD) / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      alert(`Pass duration cannot exceed 30 days. Current: ${diffDays} days`);
      return;
    }

    // ----------------------------
    // 3️⃣ Call API to save monthly pass
    // ----------------------------
    setLoading(true);

    fetch("http://127.0.0.1:8000/api/create_monthly_pass/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save pass");
        return res.json();
      })
      .then((data) => {
        console.log("Monthly pass saved:", data);
        alert("Gold Pass Registered Successfully!");
        onBack();
      })
      .catch((err) => {
        console.error("Error saving monthly pass:", err);
        alert("Failed to register pass. Check console.");
      })
      .finally(() => setLoading(false));
  };

  // ----------------------------
  // Styles
  // ----------------------------
  const inputStyle = "w-full pl-10 pr-3 py-3 rounded-xl shadow-neu-inset bg-transparent border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-sm text-gray-700 font-medium";
  const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
  const labelStyle = "text-[10px] font-black text-gray-400 ml-1 mb-1 uppercase tracking-wider";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl shadow-neu hover:text-yellow-600 transition bg-bg shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff]"
        >
          <ArrowLeft size={18} />
        </button>
        <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Premium Gold Registration</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* ---------------------------- */}
        {/* User Info */}
        {/* ---------------------------- */}
        <div className="space-y-3">
          <div className="relative">
            <p className={labelStyle}>Full Name</p>
            <User className={iconStyle} size={16} style={{ marginTop: "8px" }} />
            <input name="name" placeholder="Name" onChange={handleChange} required className={inputStyle} />
          </div>

          <div className="relative">
            <p className={labelStyle}>Email Address</p>
            <Mail className={iconStyle} size={16} style={{ marginTop: "8px" }} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required className={inputStyle} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <p className={labelStyle}>Age</p>
              <input type="number" name="age" placeholder="Age" onChange={handleChange} required className={inputStyle.replace("pl-10", "pl-4")} />
            </div>
            <div className="relative">
              <p className={labelStyle}>Vehicle No</p>
              <Hash className={iconStyle} size={14} style={{ marginTop: "8px" }} />
              <input name="vehicle_number" onChange={handleChange} required className={inputStyle}/>
            </div> 
          </div>
        </div>

        {/* ---------------------------- */}
        {/* Time & Date */}
        {/* ---------------------------- */}
        <div className="space-y-3 p-4 rounded-2xl shadow-neu-inset bg-black/5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className={labelStyle}>Daily From</p>
              <input type="time" name="start_time" onChange={handleChange} required className={inputStyle.replace("pl-10", "pl-3")} />
            </div>
            <div>
              <p className={labelStyle}>Daily To</p>
              <input type="time" name="end_time" onChange={handleChange} required className={inputStyle.replace("pl-10", "pl-3")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className={labelStyle}>Start Date</p>
              <input type="date" name="start_date" onChange={handleChange} required className={inputStyle.replace("pl-10", "pl-3")} />
            </div>
            <div>
              <p className={labelStyle}>End Date</p>
              <input type="date" name="end_date" onChange={handleChange} required className={inputStyle.replace("pl-10", "pl-3")} />
            </div>
          </div>
        </div>

        {/* ---------------------------- */}
        {/* Submit Button */}
        {/* ---------------------------- */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`mt-2 py-4 rounded-xl font-black text-black uppercase tracking-widest relative overflow-hidden group shadow-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFB800 100%)" }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <div className="flex items-center justify-center gap-2 relative z-10">
            <CheckCircle size={18} />
            {loading ? "Processing..." : "Confirm & Pay ₹2,499"}
          </div>
        </motion.button>
      </form>
    </motion.div>
  );
}
