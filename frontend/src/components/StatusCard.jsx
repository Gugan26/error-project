import React from "react";
import { motion } from "framer-motion";

export function StatusCard({
  icon: Icon,
  label,
  count,
  color,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-bg shadow-neu min-w-[140px] flex-1"
    >
      <div
        className="p-3 rounded-full shadow-neu-inset mb-3"
        style={{ color: color }}
      >
        <Icon size={24} strokeWidth={2.5} />
      </div>

      <span className="text-3xl font-bold text-gray-700 mb-1">
        {count}
      </span>

      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}
