import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBolt, FaMagic, FaEdit, FaChartLine, FaFileExcel, FaRocket } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { text: "Enter Prompt", icon: FaMagic, color: "from-purple-500 to-pink-500" },
    { text: "Make Adjustments", icon: FaEdit, color: "from-blue-500 to-cyan-500" },
    { text: "Publish & Collect Responses", icon: FaRocket, color: "from-orange-500 to-yellow-500" },
    { text: "Save to Excel in seconds", icon: FaFileExcel, color: "from-emerald-500 to-lime-500" }
  ];

  useEffect(() => {
    // Redirect to login after 8 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/login');
    }, 8000);

    // Cycle through steps every 1.5 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(stepInterval);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-gray-950 to-blue-950">
      <Toaster position="top-center" />
      
      {/* Floating Icons */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-900 opacity-[0.03]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 40 + 20}px`
          }}
          animate={{
            y: [0, Math.random() * 40 - 20],
            x: [0, Math.random() * 40 - 20],
            rotate: [0, Math.random() * 360 - 180],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <FaBolt />
        </motion.div>
      ))}

      <div className="relative z-10 text-center max-w-4xl">
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl"
              animate={{
                rotate: 360,
                transition: {
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              <FaBolt className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Formify AI
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-blue-200">
            Google Forms, but <span className="text-yellow-300">better</span> - saves you 90% of your time
          </h2>
        </motion.div>

        {/* Animated Steps */}
        <div className="relative h-32 md:h-40 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentStep === index ? 1 : 0,
                y: currentStep === index ? 0 : 20
              }}
              transition={{ duration: 0.8 }}
            >
              {/* <step.icon color='white' className="w-12 h-12 mb-4" /> */}
              <div className="text-3xl md:text-4xl font-bold">{step.text}</div>
            </motion.div>
          ))}
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-blue-200 mb-12 max-w-2xl mx-auto"
        >
          AI-powered forms that write themselves. Just describe what you need and let our AI handle the rest.
        </motion.p>

        {/* Redirect Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center"
        >
          <div className="text-blue-300 mb-2">Redirecting to login...</div>
          <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 7, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;