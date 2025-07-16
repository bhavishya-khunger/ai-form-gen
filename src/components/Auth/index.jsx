import React, { useState, useMemo } from 'react';
import {
    FaEnvelope, FaLock, FaUser, FaSpinner, FaEye, FaEyeSlash,
    FaRocket, FaPalette, FaFingerprint, FaMagic, FaShieldAlt,
    FaBolt, FaFeatherAlt, FaLeaf, FaFire, FaWater, FaMountain,
    FaExclamationTriangle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_SERVER_URI;

const iconChoices = [
    FaEnvelope, FaLock, FaUser, FaSpinner, FaEye, FaEyeSlash,
    FaRocket, FaPalette, FaFingerprint, FaMagic, FaShieldAlt,
    FaBolt, FaFeatherAlt, FaLeaf, FaFire, FaWater, FaMountain,
    FaExclamationTriangle
];

function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear specific error when user starts typing in that field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        // Clear general API error message when any input changes
        if (errors.api) {
            setErrors(prev => ({ ...prev, api: undefined }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear all errors at the start of submission

        if (validate()) {
            setLoading(true);

            try {
                const endpoint = isLogin ? '/login' : '/register'; // Adjusted to match common API paths
                const payload = isLogin 
                    ? { email: formData.email, password: formData.password }
                    : { username: formData.name, email: formData.email, password: formData.password };

                // Axios automatically handles JSON stringification and response parsing
                const response = await axios.post(`${API_BASE_URL}/api/auth${endpoint}`, payload);
                
                if (isLogin) {
                    const token = response.data.token;
                    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now
                    localStorage.setItem('token', token);
                    localStorage.setItem('token_expires_at', expiresAt);

                    toast.success(`${response?.data?.user?.username}, You're all set. Let’s get started! 🚀`, {
                        style: {
                            background: '#1A202C', // Dark background for toast
                            color: '#E2E8F0', // Light text
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                        },
                        iconTheme: {
                            primary: '#4299E1', // Blue accent
                            secondary: '#FFFFFF',
                        },
                    });
                    // In a real app, you might save a token and then navigate
                    navigate('/dashboard'); // Uncomment if you have a dashboard route
                } else {
                    toast.success(`Account created!`, {
                        style: {
                            background: '#1A202C',
                            color: '#E2E8F0',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                        },
                        iconTheme: {
                            primary: '#4299E1',
                            secondary: '#FFFFFF',
                        },
                    });
                    setIsLogin(true); // Switch to login after successful registration
                    setFormData({ name: '', email: '', password: '' }); // Clear form
                }
            } catch (error) {
                console.error("API error:", error);
                const errorMsg = 'An unexpected error occurred. Please ensure you are using correct credentials.';
                setErrors(prev => ({ ...prev, api: errorMsg }));
                
                toast.error(errorMsg, {
                    style: {
                        background: '#1A202C',
                        color: '#FC8181', // Red text for error
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    },
                    iconTheme: {
                        primary: '#E53E3E', // Red accent
                        secondary: '#FFFFFF',
                    },
                });
            } finally {
                setLoading(false);
            }
        }
    };

    // Pre-calculate fixed positions for icons using useMemo
    const positionedIcons = useMemo(() => {
        const icons = [];
        const targetCount = 25; // Number of floating icons
        
        // Fallback for window dimensions in case of SSR or initial render
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 800;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 600;

        const cols = Math.ceil(Math.sqrt(targetCount * screenWidth / screenHeight));
        const rows = Math.ceil(targetCount / cols);
        
        const xSpacing = screenWidth / cols;
        const ySpacing = screenHeight / rows;

        let iconIndex = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (icons.length >= targetCount) break;

                const IconComponent = iconChoices[iconIndex % iconChoices.length]; // Cycle through icon types
                const size = Math.random() * 80 + 40; // Random size between 40px and 120px
                
                // Calculate a fixed position within each grid cell, with some randomness
                const initialX = c * xSpacing + (Math.random() - 0.5) * (xSpacing * 0.6); // 60% randomness within cell
                const initialY = r * ySpacing + (Math.random() - 0.5) * (ySpacing * 0.6);

                // Ensure icons don't go off-screen too much
                const clampedX = Math.max(0, Math.min(screenWidth - size, initialX));
                const clampedY = Math.max(0, Math.min(screenHeight - size, initialY));

                const delay = Math.random() * 5; // Random start delay up to 5s
                const duration = Math.random() * 5 + 5; // Random duration (5-10s) for resize cycle
                const rotateValue = Math.random() * 360 - 180; // Random initial rotation

                icons.push({
                    id: `icon-${icons.length}`,
                    IconComponent,
                    initialX: clampedX,
                    initialY: clampedY,
                    size,
                    delay,
                    duration,
                    rotateValue
                });
                iconIndex++;
            }
            if (icons.length >= targetCount) break;
        }
        return icons;
    }, []); // Empty dependency array ensures this runs only once on mount


    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <Toaster position="top-center" />
            
            {/* Background gradient - Professional Theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 to-blue-950 z-0"></div>
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

            {/* Floating Icons - Muted for professionalism */}
            {positionedIcons.map((iconProps) => (
                <motion.div
                    key={iconProps.id}
                    className={`absolute text-blue-900 opacity-[0.015]`} // Very subtle blue-black, almost blends in
                    style={{ 
                        top: iconProps.initialY, 
                        left: iconProps.initialX, 
                        fontSize: iconProps.size, 
                        pointerEvents: 'none',
                        textShadow: 'none' // No glow for professionalism
                    }}
                    initial={{ opacity: 0.01, scale: 0.7, rotate: iconProps.rotateValue }} 
                    animate={{
                        scale: [0.8, 0.9, 0.8], 
                        opacity: [0.1, 0.3, 0.1], // Even more subtle fade
                        rotate: iconProps.rotateValue + (Math.random() > 0.5 ? 360 : -360), 
                    }}
                    transition={{
                        duration: iconProps.duration,
                        ease: "easeInOut", 
                        repeat: Infinity,
                        repeatType: "mirror", 
                        delay: iconProps.delay,
                    }}
                >
                    <iconProps.IconComponent />
                </motion.div>
            ))}

            {/* Main Form Card - Professional Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md z-10 border border-blue-900" 
            >
                {/* Accent header bar */}
                <div className="h-1.5 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                
                <div className="p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <motion.div 
                                className="w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center shadow-lg"
                                animate={{
                                    rotate: 360,
                                    transition: {
                                        duration: 15,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }
                                }}
                            >
                                {/* Using a lightning bolt icon for a professional/tech feel */}
                                <FaBolt className="w-8 h-8 text-cyan-300" /> 
                            </motion.div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-100"> 
                            {isLogin ? 'Access Your Account' : 'Create New Account'}
                        </h2>
                        <p className="text-gray-400 mt-2"> 
                            {isLogin ? 'Securely sign in to continue your work.' : 'Register to get started with our services.'}
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} noValidate>
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="mb-4"
                            >
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label> 
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <FaUser /> 
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Alex Johnson"
                                        className={`pl-10 pr-4 w-full p-3 bg-gray-800 text-gray-100 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition`} 
                                        aria-invalid={errors.name ? "true" : "false"}
                                        aria-describedby="name-error"
                                    />
                                </div>
                                {errors.name && <p id="name-error" className="mt-1 text-sm text-red-400">{errors.name}</p>} 
                            </motion.div>
                        )}

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <FaEnvelope />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="alex@example.com"
                                    className={`pl-10 pr-4 w-full p-3 bg-gray-800 text-gray-100 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition`}
                                    aria-invalid={errors.email ? "true" : "false"}
                                    aria-describedby="email-error"
                                />
                            </div>
                            {errors.email && <p id="email-error" className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <FaLock />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'} 
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`pl-10 pr-10 w-full p-3 bg-gray-800 text-gray-100 border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition`}
                                    aria-invalid={errors.password ? "true" : "false"}
                                    aria-describedby="password-error"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none text-gray-500 hover:text-gray-400"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <p id="password-error" className="mt-1 text-sm text-red-400">{errors.password}</p>}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 119, 204, 0.3)" }} // Blue shadow
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-800 hover:to-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg flex items-center justify-center" 
                        >
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="mr-2"
                                    >
                                        <FaSpinner />
                                    </motion.div>
                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                </>
                            ) : (
                                isLogin ? 'Sign In' : 'Get Started'
                            )}
                        </motion.button>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-center text-sm text-gray-400" 
                    >
                        {isLogin ? (
                            <>
                                New here?{' '}
                                <button
                                    onClick={() => {
                                        setIsLogin(false);
                                        setErrors({});
                                        setFormData({ name: '', email: '', password: '' });
                                    }}
                                    className="font-medium text-blue-500 hover:text-blue-400 focus:outline-none underline underline-offset-2"
                                >
                                    Create an account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => {
                                        setIsLogin(true);
                                        setErrors({});
                                        setFormData({ name: '', email: '', password: '' });
                                    }}
                                    className="font-medium text-blue-500 hover:text-blue-400 focus:outline-none underline underline-offset-2"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-800 px-8 py-4 text-center border-t border-gray-700" 
                >
                    <p className="text-xs text-gray-500"> 
                        By continuing, you agree to our{' '}
                        <a href="#" className="font-medium text-blue-500 hover:text-blue-400 underline">Terms</a> and{' '}
                        <a href="#" className="font-medium text-blue-500 hover:text-blue-400 underline">Privacy Policy</a>.
                    </p>
                </motion.div> */}
            </motion.div>
        </div>
    );
}

export default AuthForm;