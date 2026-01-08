import React from "react";
import { motion } from "framer-motion";
import { Car, Bike, CheckCircle, Clock } from "lucide-react";

export function ParkingSpot({
  id,
  type,
  status,
  capacity,
  occupancy,
  isSelected,
  onSelect,
}) {

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "#a8d5ba"; // green
      case "partial":
        return "#fbd38d"; // orange
      case "occupied":
        return "#e0a8a8"; // red
      case "reserved":
        return "#a8c5e0"; // blue
      default:
        return "#cbd5e0";
    }
  };


  const getStatusIcon = () => {
    if (status === "reserved") {
      return <Clock size={24} className="text-blue-600 opacity-50" />;
    }

    if (type === "bike") {
      return (
        <Bike
          size={28}
          className={
            status === "available"
              ? "text-green-600 opacity-50"
              : "text-orange-500 opacity-60"
          }
        />
      );
    }

    switch (status) {
      case "available":
        return <CheckCircle size={24} className="text-green-600 opacity-50" />;
      case "occupied":
        return <Car size={28} className="text-red-500 opacity-60" />;
      default:
        return <Car size={28} className="text-gray-400 opacity-60" />;
    }
  };

  /* =======================
     IMPORTANT FIX
     Occupied also clickable
  ======================= */
  const isInteractive = true;

  return (
    <motion.button
      layout
      onClick={() => onSelect(id)} // occupied also clickable
      whileHover={isInteractive ? { y: -4, scale: 1.02 } : {}}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
      animate={{
        boxShadow: isSelected
          ? "inset 6px 6px 10px 0 rgba(163,177,198,0.7), inset -6px -6px 10px 0 rgba(255,255,255,0.8)"
          : "9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)",
      }}
      className={`
        relative flex flex-col items-center justify-center h-40 w-full rounded-2xl transition-colors duration-300
        bg-bg cursor-pointer
        border-2 ${isSelected ? "border-neu-blue" : "border-transparent"}
      `}
    >
      {/* Status Dot */}
      <div
        className="absolute top-4 right-4 w-3 h-3 rounded-full shadow-neu-inset"
        style={{ backgroundColor: getStatusColor() }}
      />

      {/* Spot Number */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="text-xs font-bold text-gray-400">
          #{id.toString().padStart(3, "0")}
        </span>
      </div>

      {/* Icon */}
      <div className="mb-2">{getStatusIcon()}</div>

      {/* Label */}
      <span className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-1">
        {status === "partial" ? "Available" : status}
      </span>

      {/* Bike Capacity */}
      {type === "bike" && (
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="text-xs font-medium text-gray-500">
            {occupancy}/{capacity} Bikes
          </div>

          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancy >= capacity ? "bg-red-400" : "bg-orange-400"
              }`}
              style={{ width: `${(occupancy / capacity) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Floor Mark */}
      <div className="absolute bottom-3 w-12 h-1 bg-gray-300 rounded-full opacity-20" />
    </motion.button>
  );
}
