import React, { useState } from "react";
import { motion } from "framer-motion";
import { ParkingSpot } from "./ParkingSpot";
import { StatusCard } from "./StatusCard";
import { ReservationPanel } from "./ReservationPanel";
import { Car, CheckCircle, MapPin, Bike, AlertTriangle, Star } from "lucide-react";

// Emergency slots (Top)
const EMERGENCY_SLOTS = Array.from({ length: 4 }, (_, i) => ({
  id: `emg-${i + 1}`,
  type: "car",
  status: "occupied",
  isEmergency: true,
  label: "Emergency"
}));

// VIP slots (Bottom)
const VIP_SLOTS = Array.from({ length: 4 }, (_, i) => ({
  id: `vip-${i + 1}`,
  type: "car",
  status: "VIP",
  isVIP: true,
  label: "VIP"
}));

const INITIAL_SPOTS = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    type: "car",
    capacity: 1,
    occupancy: 0,
    status: "available",
    formData: null,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 9,
    type: "bike",
    capacity: 4,
    occupancy: 0,
    status: "available",
    formData: null,
  })),
];

export function ParkingDashboard() {
  const [spots, setSpots] = useState(INITIAL_SPOTS);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const selectedSpot = spots.find((s) => s.id === selectedSpotId);

  const stats = {
    availableCars: spots.filter(
      (s) => s.type === "car" && s.status === "available"
    ).length,
    availableBikes: spots.reduce(
      (acc, s) =>
        s.type === "bike" ? acc + (s.capacity - s.occupancy) : acc,
      0
    ),
    // Total occupied includes 4 Emergency + 4 VIP slots
    totalOccupied: spots.reduce((acc, s) => acc + s.occupancy, 0) + 8,
  };

  const handleSpotSelect = (id) => {
    const selectedIndex = spots.findIndex((s) => s.id === id);
    const selectedType = spots[selectedIndex].type;

    const firstEmptySpot = spots.find(
      (spot, index) =>
        spot.type === selectedType &&
        spot.status === "available" &&
        index < selectedIndex
    );

    if (firstEmptySpot) {
      alert(`Plz book previous slot`);
      return;
    }

    setSelectedSpotId(id);
    setIsPanelOpen(true);
  };

  const handleReservation = (spotId, data) => {
    setSpots((prev) =>
      prev.map((spot) => {
        if (spot.id !== spotId) return spot;
        const newOccupancy = spot.type === "bike" ? Math.min(spot.capacity, spot.occupancy + 1) : 1;
        return {
          ...spot,
          occupancy: newOccupancy,
          status: newOccupancy > 0 ? "occupied" : "available",
          formData: data,
        };
      })
    );
    setIsPanelOpen(false);
    setSelectedSpotId(null);
  };

  const handleCancelReservation = (spotId, type = "car", count = 1) => {
    setSpots((prev) =>
      prev.map((spot) => {
        if (spot.id !== spotId) return spot;
        if (type === "bike") {
          const newOccupancy = Math.max(0, spot.occupancy - count);
          return { ...spot, occupancy: newOccupancy, status: newOccupancy > 0 ? "occupied" : "available" };
        }
        return { ...spot, occupancy: 0, status: "available", formData: null };
      })
    );
    setIsPanelOpen(false);
    setSelectedSpotId(null);
    alert("Reservation cancelled successfully");
  };

  const carSpots = spots.filter((s) => s.type === "car");
  const bikeSpots = spots.filter((s) => s.type === "bike");

  return (
    <div className="min-h-screen bg-bg p-6 font-sans text-text">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
            <div className="p-4 rounded-full shadow-neu bg-bg text-neu-blue">
              <MapPin size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-700">VDart</h1>
              <p className="text-gray-500">Smart Parking Management</p>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <StatusCard icon={Car} label="Car Spots" count={stats.availableCars} />
            <StatusCard icon={Bike} label="Bike Slots" count={stats.availableBikes} />
            <StatusCard icon={CheckCircle} label="Total Parked" count={stats.totalOccupied} />
          </div>
        </header>

        {/* 1. EMERGENCY ZONE */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-600">
            <AlertTriangle /> Emergency Parking (Locked)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EMERGENCY_SLOTS.map((slot) => (
              <div key={slot.id} className="opacity-80 pointer-events-none">
                 <ParkingSpot {...slot} onSelect={null} />
              </div>
            ))}
          </div>
        </section>

        {/* 2. CAR ZONE */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Car /> General Car Zone
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {carSpots.map((spot) => (
              <ParkingSpot
                key={spot.id}
                {...spot}
                isSelected={selectedSpotId === spot.id}
                onSelect={handleSpotSelect}
              />
            ))}
          </div>
        </section>

        {/* 3. BIKE ZONE */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Bike /> Bike Parking Zone
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bikeSpots.map((spot) => (
              <ParkingSpot
                key={spot.id}
                {...spot}
                isSelected={selectedSpotId === spot.id}
                onSelect={handleSpotSelect}
              />
            ))}
          </div>
        </section>

        {/* 4. VIP ZONE - Below Bike Slots */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-600">
            <Star /> VIP Parking Zone
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VIP_SLOTS.map((slot) => (
              <div key={slot.id} className="opacity-90 pointer-events-none">
                 <ParkingSpot {...slot} onSelect={null} />
              </div>
            ))}
          </div>
        </section>

        <ReservationPanel
          spotId={selectedSpotId}
          spotType={selectedSpot?.type}
          capacity={selectedSpot?.capacity}
          occupancy={selectedSpot?.occupancy}
          isOpen={isPanelOpen}
          onClose={() => {
            setIsPanelOpen(false);
            setSelectedSpotId(null);
          }}
          onSubmit={handleReservation}
          onCancel={handleCancelReservation}
        />
      </div>
    </div>
  );
}