import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaFingerprint, FaSatelliteDish } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_SERVER_URI;

const AuthInterface = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [biometricActive, setBiometricActive] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
        if (errors.api) setErrors(prev => ({ ...prev, api: undefined }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Min 6 characters';
        }

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'Required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (validate()) {
            setLoading(true);

            try {
                const endpoint = isLogin ? '/login' : '/register';
                const payload = isLogin 
                    ? { email: formData.email, password: formData.password }
                    : { username: formData.name, email: formData.email, password: formData.password };

                const response = await axios.post(`${API_BASE_URL}/api/auth${endpoint}`, payload);
                
                if (isLogin) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('token_expires_at', Date.now() + 2 * 60 * 60 * 1000);

                    toast.success(`Welcome back, ${response?.data?.user?.username}!`, {
                        style: {
                            background: 'rgba(20, 20, 30, 0.9)',
                            color: '#E2E8F0',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        },
                        iconTheme: {
                            primary: '#6d28d9',
                            secondary: '#FFFFFF',
                        },
                    });
                    navigate('/dashboard');
                } else {
                    toast.success('Account created!', {
                        style: {
                            background: 'rgba(20, 20, 30, 0.9)',
                            color: '#E2E8F0',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)'
                        },
                        iconTheme: {
                            primary: '#6d28d9',
                            secondary: '#FFFFFF',
                        },
                    });
                    setIsLogin(true);
                    setFormData({ name: '', email: '', password: '' });
                }
            } catch (error) {
                console.error("API error:", error);
                const errorMsg = error.response?.data?.message || 'Authentication failed';
                setErrors(prev => ({ ...prev, api: errorMsg }));
                
                toast.error(errorMsg, {
                    style: {
                        background: 'rgba(30, 10, 10, 0.9)',
                        color: '#FECACA',
                        border: '1px solid rgba(255, 100, 100, 0.2)',
                        backdropFilter: 'blur(10px)'
                    },
                    iconTheme: {
                        primary: '#EF4444',
                        secondary: '#FFFFFF',
                    },
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const simulateBiometric = () => {
        setBiometricActive(true);
        setTimeout(() => {
            setBiometricActive(false);
            toast.success('Biometric authentication successful!', {
                style: {
                    background: 'rgba(20, 20, 30, 0.9)',
                    color: '#E2E8F0',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                },
                iconTheme: {
                    primary: '#6d28d9',
                    secondary: '#FFFFFF',
                },
            });
            navigate('/dashboard');
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 overflow-hidden relative">
            <Toaster position="top-center" />
            
            {/* Futuristic Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}></div>
                
                {/* Floating orbs */}
                <motion.div 
                    className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-900 filter blur-3xl opacity-20"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: 'reverse'
                    }}
                />
                <motion.div 
                    className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-blue-900 filter blur-3xl opacity-20"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse'
                    }}
                />
                
                {/* Connection lines animation */}
                <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 200 + 100}px`,
                                opacity: 0.3
                            }}
                            animate={{
                                x: [0, Math.random() * 200 - 100],
                                opacity: [0.1, 0.3, 0.1]
                            }}
                            transition={{
                                duration: Math.random() * 10 + 5,
                                repeat: Infinity,
                                repeatType: 'reverse'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Auth Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md z-10"
            >
                {/* Glass morphic card */}
                <div className="backdrop-blur-lg bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                    {/* Holographic header */}
                    <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-400 to-purple-600"></div>
                    
                    <div className="p-8">
                        {/* Logo/Header */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center mb-8"
                        >
                            <motion.div
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mb-4 shadow-lg"
                                animate={{
                                    rotate: 360,
                                    transition: {
                                        duration: 20,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }
                                }}
                            >
                                <FaSatelliteDish className="w-8 h-8 text-white" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white text-center">
                                {isLogin ? 'ACCESS GRANTED' : 'NEW IDENTITY'}
                            </h2>
                            <p className="text-gray-400 mt-2 text-center">
                                {isLogin ? 'Authentication required' : 'Register new profile'}
                            </p>
                        </motion.div>

                        {/* Biometric Auth Option */}
                        {isLogin && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mb-6"
                            >
                                <button
                                    onClick={simulateBiometric}
                                    disabled={biometricActive}
                                    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${biometricActive 
                                        ? 'bg-purple-900/50 text-purple-300' 
                                        : 'bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 hover:text-white border border-purple-700/50 hover:border-purple-500'}`}
                                >
                                    {biometricActive ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="mr-2"
                                            >
                                                <FaFingerprint className="animate-pulse" />
                                            </motion.div>
                                            Scanning...
                                        </>
                                    ) : (
                                        <>
                                            <FaFingerprint className="mr-2" />
                                            Use Biometric Authentication
                                        </>
                                    )}
                                </button>
                                <div className="flex items-center my-4">
                                    <div className="flex-grow border-t border-gray-700/50"></div>
                                    <span className="mx-4 text-gray-500 text-sm">OR</span>
                                    <div className="flex-grow border-t border-gray-700/50"></div>
                                </div>
                            </motion.div>
                        )}

                        {/* Auth Form */}
                        <form onSubmit={handleSubmit} noValidate>
                            <AnimatePresence>
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mb-4 overflow-hidden"
                                    >
                                        <div className={`relative transition-all duration-200 ${activeField === 'name' ? 'opacity-100' : 'opacity-90'}`}>
                                            <label 
                                                htmlFor="name" 
                                                className={`block text-xs font-medium mb-1 transition-all duration-200 ${activeField === 'name' ? 'text-purple-400' : 'text-gray-400'}`}
                                            >
                                                FULL NAME
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                                    <FaUser className={`transition-all duration-200 ${activeField === 'name' ? 'text-purple-400 scale-110' : ''}`} />
                                                </div>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    onFocus={() => setActiveField('name')}
                                                    onBlur={() => setActiveField(null)}
                                                    placeholder="Enter your full name"
                                                    className={`pl-10 pr-4 w-full py-3 bg-gray-800/70 border ${errors.name ? 'border-red-500/50' : 'border-gray-700/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 text-white placeholder-gray-500 transition-all duration-200`}
                                                    aria-invalid={errors.name ? "true" : "false"}
                                                />
                                            </div>
                                            {errors.name && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-1 text-xs text-red-400"
                                                >
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={`mb-4 transition-all duration-200 ${activeField === 'email' ? 'opacity-100' : 'opacity-90'}`}>
                                <label 
                                    htmlFor="email" 
                                    className={`block text-xs font-medium mb-1 transition-all duration-200 ${activeField === 'email' ? 'text-purple-400' : 'text-gray-400'}`}
                                >
                                    EMAIL ADDRESS
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <FaEnvelope className={`transition-all duration-200 ${activeField === 'email' ? 'text-purple-400 scale-110' : ''}`} />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('email')}
                                        onBlur={() => setActiveField(null)}
                                        placeholder="your@email.com"
                                        className={`pl-10 pr-4 w-full py-3 bg-gray-800/70 border ${errors.email ? 'border-red-500/50' : 'border-gray-700/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 text-white placeholder-gray-500 transition-all duration-200`}
                                        aria-invalid={errors.email ? "true" : "false"}
                                    />
                                </div>
                                {errors.email && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-xs text-red-400"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </div>

                            <div className={`mb-6 transition-all duration-200 ${activeField === 'password' ? 'opacity-100' : 'opacity-90'}`}>
                                <label 
                                    htmlFor="password" 
                                    className={`block text-xs font-medium mb-1 transition-all duration-200 ${activeField === 'password' ? 'text-purple-400' : 'text-gray-400'}`}
                                >
                                    PASSWORD
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                        <FaLock className={`transition-all duration-200 ${activeField === 'password' ? 'text-purple-400 scale-110' : ''}`} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('password')}
                                        onBlur={() => setActiveField(null)}
                                        placeholder="••••••••"
                                        className={`pl-10 pr-10 w-full py-3 bg-gray-800/70 border ${errors.password ? 'border-red-500/50' : 'border-gray-700/50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 text-white placeholder-gray-500 transition-all duration-200`}
                                        aria-invalid={errors.password ? "true" : "false"}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none text-gray-500 hover:text-purple-400 transition-all"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1 text-xs text-red-400"
                                    >
                                        {errors.password}
                                    </motion.p>
                                )}
                            </div>

                            {errors.api && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm"
                                >
                                    {errors.api}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-800/50 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="mr-2"
                                        >
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        </motion.div>
                                        {isLogin ? 'AUTHENTICATING...' : 'CREATING PROFILE...'}
                                    </>
                                ) : (
                                    isLogin ? 'ACCESS SYSTEM' : 'REGISTER PROFILE'
                                )}
                            </motion.button>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-6 text-center text-sm"
                        >
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setErrors({});
                                    setFormData({ name: '', email: '', password: '' });
                                }}
                                className="text-purple-400 hover:text-purple-300 focus:outline-none transition-all duration-200 font-medium"
                            >
                                {isLogin ? 'CREATE NEW PROFILE' : 'ALREADY HAVE PROFILE?'}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthInterface;