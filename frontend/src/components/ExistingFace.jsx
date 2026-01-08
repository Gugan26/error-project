import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 1. React Router-ah import pannunga
import { useNavigate } from "react-router-dom"; 
import { 
  ArrowLeft, ShieldCheck, Scan, 
  RefreshCw, Loader2 
} from "lucide-react";

export default function ExistingFace() {
  // 2. useNavigate hook-ai initialize pannunga
  const navigate = useNavigate(); 
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Camera access denied.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      stopCamera();
    }, 3000); 
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[400px] bg-gray-100 rounded-[40px] shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] p-8">
        
        <div className="flex items-center justify-between mb-8">
          {/* Back click panna home-ku poga navigate("/") kudunga */}
          <button onClick={() => navigate("/")} className="p-3 rounded-2xl bg-gray-100 shadow-[4px_4px_10px_#b8b9be]">
            <ArrowLeft size={20} />
          </button>
          <div className="text-right">
            <h2 className="text-xl font-black text-gray-700">Identity Scan</h2>
            <p className="text-[10px] font-bold text-blue-500 uppercase">Live Bio-Auth</p>
          </div>
        </div>

        <div className="relative aspect-square rounded-[32px] bg-black overflow-hidden border-[6px] border-white mb-8">
          {!scanComplete && <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />}
          {isScanning && (
            <motion.div 
              initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: 2, repeat: Infinity }}
              className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_15px_#3b82f6] z-10"
            />
          )}
          <AnimatePresence>
            {scanComplete && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-green-500 text-white z-20">
                <ShieldCheck size={80} />
                <p className="text-lg font-bold mt-4">VERIFIED</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {!isScanning && !scanComplete && (
            <button onClick={handleStartScan} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-3">
              <Scan size={20} /> Start Scan
            </button>
          )}
          {isScanning && (
            <div className="w-full py-5 rounded-2xl bg-gray-200 text-gray-500 font-bold flex items-center justify-center gap-3">
              <Loader2 className="animate-spin" /> Scanning...
            </div>
          )}
          {scanComplete && (
            <button 
              // 3. Inga thaan 'navigate' use panni dashboard-ku pogurom
              onClick={() => navigate("/dashboard")} 
              className="w-full py-5 rounded-2xl bg-white border text-gray-700 font-bold flex items-center justify-center gap-3 shadow-md hover:bg-gray-50"
            >
              <RefreshCw size={18} /> Submit to Dashboard
            </button> 
          )}
        </div>
      </motion.div>
    </div>
  );
}