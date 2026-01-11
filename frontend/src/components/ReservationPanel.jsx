import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import { X, Calendar, User, Mail, Lock, Car, Bike, Clock, Camera, VideoOff, ChevronRight } from "lucide-react";
import { MonthlyPassForm } from "./MonthlyPassForm";
import { YearlyPassForm } from "./YearlyPassForm.jsx";

export function ReservationPanel({
  spotId,
  spotType = "car",
  capacity = 1,
  occupancy = 0,
  isOpen,
  onClose,
  onSubmit,
  onCancel,
}) {
  const [qrImage, setQrImage] = useState(null);
  const [step, setStep] = useState(1);
  const [showMonthlyPass, setShowMonthlyPass] = useState(false);
  const [showYearlyPass, setShowYearlyPass] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    startTime: "",
    endTime: "",
    vehicleType: spotType,
    durationHours: 0,
  });

  const isOccupiedView = (spotType === "car" && occupancy >= capacity) || (spotType === "bike" && occupancy >= 1);

  const canProceed = (...fields) => fields.every((f) => f !== undefined && f !== null && String(f).trim() !== "");

  // Webcam Logic
  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.log("Webcam access optional: ", err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setShowMonthlyPass(false);
      setShowYearlyPass(false);
      setQrImage(null);
      setFormData({
        name: "", email: "", password: "", startTime: "", endTime: "",
        vehicleType: spotType, durationHours: 0,
      });
    }
    return () => stopWebcam();
  }, [isOpen, spotId, spotType]);

// ReservationPanel function kulla...
useEffect(() => {
  let interval;

  // QR image display-la iruntha mattum check panna aarambikum
  if (qrImage) {
    interval = setInterval(async () => {
      try {
        const response = await API.get(`check-scan-status/${spotId}/`);
        
        if (response.data.is_scanned === true) {
          alert("QR Scanned Successfully! Closing Panel...");
          clearInterval(interval);
          onClose(); // Inga thaan unga panel close aaguthu
          
          // Optional: State-a clear panna
          setQrImage(null);
          setStep(1);
        }
      } catch (error) {
        console.error("Scanning error:", error);
      }
    }, 2000); // 2 seconds-ku oru vaati check pannum
  }

  return () => clearInterval(interval); // Component close aana stop aagidum
}, [qrImage, spotId, onClose]);

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!spotId) return;
    stopWebcam();

    const [sh, sm] = formData.startTime.split(":").map(Number);
    const [eh, em] = formData.endTime.split(":").map(Number);
    let start = sh * 60 + sm;
    let end = eh * 60 + em;
    if (end <= start) end += 1440;
    const duration = (end - start) / 60;

    try {
      await API.post("reserve/", {
        spot_id: spotId,
        spot_type: spotType,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        start_time: formData.startTime,
        end_time: formData.endTime,
        duration_hours: duration,
      });
      alert("Reservation successful!");
      onSubmit(spotId, { ...formData, durationHours: duration });
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || "Reservation failed");
    }
  };

  const handleCancelClick = async () => {
    if (!formData.email || !formData.password) return alert("Please enter both Gmail and Password");
    try {
      const response = await API.post("cancel-reservation/", {
        spot_id: spotId, email: formData.email, password: formData.password,
      });
      alert(response.data.success);
      if (response.data.qr)  setQrImage(`http://127.0.0.1:8000/${response.data.qr}?t=${new Date().getTime()}`);
      else { onCancel(spotId, spotType); onClose(); }
    } catch (error) {
      alert(error.response?.data?.error || "Cancel failed");
    }
  };

  const setQuickTime = (hrs) => {
    const now = new Date();
    const end = new Date(now.getTime() + hrs * 60 * 60 * 1000);
    const f = (n) => n.toString().padStart(2, "0");
    setFormData({
      ...formData,
      startTime: `${f(now.getHours())}:${f(now.getMinutes())}`,
      endTime: `${f(end.getHours())}:${f(end.getMinutes())}`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }} className="fixed inset-y-0 right-0 w-full md:w-96 bg-bg z-50 p-8 overflow-y-auto shadow-2xl">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">
              {showMonthlyPass ? "Monthly Pass" : showYearlyPass ? "Yearly Pass" : isOccupiedView ? "Occupied Access" : "Reserve"}
            </h2>
            <button onClick={() => { stopWebcam(); onClose(); }} className="p-2 rounded-full shadow-neu"><X size={20} /></button>
          </div>

          {/* Slot Info Card */}
          <div className="mb-8 p-5 rounded-2xl shadow-neu-inset bg-bg flex justify-between items-center">
            <div><p className="text-sm text-gray-500 font-semibold uppercase">Slot</p><p className="text-3xl font-extrabold text-neu-blue">{spotId}</p></div>
            <div className={`h-12 w-12 rounded-full shadow-neu flex items-center justify-center text-white ${spotType === "bike" ? "bg-orange-400" : "bg-neu-blue"}`}>
              {spotType === "bike" ? <Bike size={24} /> : <Car size={24} />}
            </div>
          </div>

          {showMonthlyPass ? <MonthlyPassForm onBack={() => setShowMonthlyPass(false)} /> :
           showYearlyPass ? <YearlyPassForm onBack={() => setShowYearlyPass(false)} /> : (
            <form onSubmit={handleReservationSubmit}>
              <AnimatePresence mode="wait">
                {isOccupiedView ? (
                  /* Occupied Flow: 1. Email -> 2. Password -> 3. Actions */
                  step === 1 ? (
                    <motion.div key="occ-1" className="space-y-4">
                      <label className="flex gap-2 text-sm font-bold text-gray-600"><Mail size={16} /> Gmail</label>
                      <input className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-transparent outline-none border-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      <button type="button" onClick={() => canProceed(formData.email) ? setStep(2) : alert("Enter Gmail")} className="w-full py-3 rounded-xl shadow-neu font-bold text-gray-700">Next</button>
                    </motion.div>
                  ) : step === 2 ? (
                    <motion.div key="occ-2" className="space-y-4">
                      <label className="flex gap-2 text-sm font-bold text-gray-600"><Lock size={16} /> Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-transparent outline-none border-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                      <button type="button" onClick={() => canProceed(formData.password) ? setStep(3) : alert("Enter Password")} className="w-full py-3 rounded-xl shadow-neu font-bold text-gray-700">Continue</button>
                    </motion.div>
                  ) : step === 3 ? (
                    <motion.div key="s4" className="space-y-4">
                      <label className="flex gap-2 text-sm font-bold text-gray-600"><Camera size={16}/> Identity Verification</label>
                      <div className="relative overflow-hidden rounded-2xl bg-black aspect-video shadow-neu-inset flex items-center justify-center border-4 border-white">
                        {!stream && <p className="text-gray-500 text-[10px] uppercase font-bold text-center px-4">Camera is Off / Not Required</p>}
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-3">
                        {!stream ? (
                          <button type="button" onClick={startWebcam} className="flex-1 py-3 rounded-xl shadow-neu font-bold flex items-center justify-center gap-2 bg-white text-gray-700"><Camera size={16} /> Start Cam</button>
                        ) : (
                          <button type="button" onClick={stopWebcam} className="flex-1 py-3 rounded-xl shadow-neu font-bold flex items-center justify-center gap-2 bg-red-50 text-red-600"><VideoOff size={16} /> Stop Cam</button>
                        )}
                      </div>
                      <button type="button" onClick={() => { stopWebcam(); setStep(5); }} className="w-full py-3 rounded-xl shadow-neu font-bold flex items-center justify-center gap-2 text-gray-700">Next Step <ChevronRight size={16}/></button>
                    </motion.div>
                  ) : (
                    <motion.div key="occ-3" className="flex flex-col gap-4">
                      <button type="button" onClick={() => alert("Extended (Demo)")} className="py-3 rounded-xl shadow-neu font-extrabold flex justify-center gap-2 text-gray-700"><Clock size={18} /> Extend Time</button>
                      <button type="button" onClick={handleCancelClick} className="py-3 rounded-xl shadow-neu font-extrabold text-red-500">Cancel Reservation</button>
                      {qrImage && (
                        <div className="mt-6 flex flex-col items-center gap-2">
                          <p className="font-bold text-green-600">Cancellation QR</p>
                          <img src={qrImage} alt="QR Code" className="w-40 h-40 rounded-xl shadow-neu border-8 border-white"/>
                        </div>
                      )}
                    </motion.div>
                  )
                ) : (
                  /* Normal Flow: 1. Name -> 2. Email -> 3. Password -> 4. Camera -> 5. Time */
                  step === 1 ? (
                    <motion.div key="s1" className="space-y-4">
                      <label className="flex gap-2 text-sm font-bold text-gray-600"><User size={16} /> Name</label>
                      <input className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-transparent outline-none border-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      <button type="button" onClick={() => canProceed(formData.name) ? setStep(2) : alert("Enter Name")} className="w-full py-3 rounded-xl shadow-neu font-bold text-gray-700">Next</button>
                      <div className="mt-10 flex flex-col gap-4">
                        <button type="button" onClick={() => setShowMonthlyPass(true)} className="w-full py-4 rounded-2xl font-extrabold bg-yellow-400 shadow-neu text-gray-800">Monthly Pass</button>
                        <button type="button" onClick={() => setShowYearlyPass(true)} className="w-full py-4 rounded-2xl font-extrabold bg-yellow-400 shadow-neu text-gray-800">Yearly Pass</button>
                      </div>
                    </motion.div>
                  ) : step === 2 ? (
                    <motion.div key="s2" className="space-y-4">
                      <label className="flex gap-2 text-sm font-bold text-gray-600"><Mail size={16} /> Gmail</label>
                      <input className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-transparent outline-none border-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      <button type="button" onClick={() => canProceed(formData.email) ? setStep(3) : alert("Enter Gmail")} className="w-full py-3 rounded-xl shadow-neu font-bold text-gray-700">Next</button>
                    </motion.div>
                  ) : step === 3 ? (
                    <motion.div key="s3" className="space-y-4">
                      <label className="flex gap-2 text-sm font-bold text-gray-600"><Lock size={16} /> Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-transparent outline-none border-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                      <button type="button" onClick={() => canProceed(formData.password) ? setStep(4) : alert("Enter Password")} className="w-full py-3 rounded-xl shadow-neu font-bold text-gray-700">Next</button>
                    </motion.div>
                  ) : step === 4 ? (
                    <motion.div key="s4" className="space-y-4">
                      <label className="flex gap-2 text-sm font-bold text-gray-600"><Camera size={16}/> Identity Verification</label>
                      <div className="relative overflow-hidden rounded-2xl bg-black aspect-video shadow-neu-inset flex items-center justify-center border-4 border-white">
                        {!stream && <p className="text-gray-500 text-[10px] uppercase font-bold text-center px-4">Camera is Off / Not Required</p>}
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-3">
                        {!stream ? (
                          <button type="button" onClick={startWebcam} className="flex-1 py-3 rounded-xl shadow-neu font-bold flex items-center justify-center gap-2 bg-white text-gray-700"><Camera size={16} /> Start Cam</button>
                        ) : (
                          <button type="button" onClick={stopWebcam} className="flex-1 py-3 rounded-xl shadow-neu font-bold flex items-center justify-center gap-2 bg-red-50 text-red-600"><VideoOff size={16} /> Stop Cam</button>
                        )}
                      </div>
                      <button type="button" onClick={() => { stopWebcam(); setStep(5); }} className="w-full py-3 rounded-xl shadow-neu font-bold flex items-center justify-center gap-2 text-gray-700">Next Step <ChevronRight size={16}/></button>
                    </motion.div>
                  ) : (
                    <motion.div key="s5" className="space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setQuickTime(1)} className="shadow-neu py-2 rounded-xl bg-transparent text-gray-700 font-bold">1 Hr</button>
                        <button type="button" onClick={() => setQuickTime(2)} className="shadow-neu py-2 rounded-xl bg-transparent text-gray-700 font-bold">2 Hr</button>
                      </div>
                      <input type="time" className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-transparent outline-none border-none" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
                      <input type="time" className="w-full px-4 py-3 rounded-xl shadow-neu-inset bg-transparent outline-none border-none" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
                      <button type="submit" className="w-full py-4 rounded-xl shadow-neu font-extrabold flex justify-center gap-2 bg-neu-blue text-white hover:opacity-90 transition-opacity"><Calendar size={20} /> Confirm Reservation</button>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}


