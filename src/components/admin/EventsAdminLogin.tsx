import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type LoginType = 'coordinator' | 'club';

interface LoginFormData {
    email?: string;
    clubId?: string;
    password: string;
    rememberMe: boolean;
}

interface EventsAdminLoginProps {
    onBack: () => void;
    onCoordinatorLogin: () => void;
    onClubLogin: (clubId: string) => void;
}

const EventsAdminLogin: React.FC<EventsAdminLoginProps> = ({ onBack, onCoordinatorLogin, onClubLogin }) => {
    const [loginType, setLoginType] = useState<LoginType>('coordinator');
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        clubId: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (loginType === 'coordinator' && !formData.email) {
            setError('Please enter your coordinator email');
            return;
        }
        if (loginType === 'club' && !formData.clubId) {
            setError('Please enter your club ID');
            return;
        }
        if (!formData.password) {
            setError('Please enter your password');
            return;
        }

        setIsLoading(true);

        try {
            if (loginType === 'coordinator') {
                // Coordinator login
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email: formData.email!,
                    password: formData.password
                });

                if (authError) throw authError;

                // Check if user is coordinator
                const { data: coordinator, error: coordError } = await supabase
                    .from('coordinators')
                    .select('*')
                    .eq('user_id', authData.user.id)
                    .single();

                if (coordError || !coordinator) {
                    await supabase.auth.signOut();
                    throw new Error('You are not authorized as a coordinator');
                }

                // Success - redirect to coordinator dashboard
                onCoordinatorLogin();

            } else {
                // Club president login
                // First get club details by club_id
                const { data: club, error: clubError } = await supabase
                    .from('clubs')
                    .select('*')
                    .eq('club_id', formData.clubId!.trim().toLowerCase())
                    .single();

                if (clubError || !club) {
                    throw new Error('Club ID not found. Contact coordinator.');
                }

                // Now authenticate with president's email
                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email: club.president_email,
                    password: formData.password
                });

                if (authError) throw authError;

                // Store club_id for later use
                localStorage.setItem('current_club_id', club.id);
                localStorage.setItem('current_club_name', club.club_name);

                // Success - redirect to club dashboard
                onClubLogin(club.id);
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
            setFormData({ ...formData, password: '' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabSwitch = (type: LoginType) => {
        setLoginType(type);
        setFormData({ email: '', clubId: '', password: '', rememberMe: false });
        setError(null);
    };

    return (
        <div className="min-h-screen flex font-['Inter']">

            {/* LEFT COLUMN - HERO SECTION */}
            <div
                className="hidden lg:flex lg:w-[60%] bg-[#FAFAFA] relative flex-col justify-center p-16"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            >
                <div className="max-w-xl">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-12">
                        <span className="text-2xl">🎓</span>
                        <span className="text-2xl font-bold font-['Space_Mono'] tracking-tight">SANKALAN</span>
                    </div>

                    {/* Hero Title */}
                    <h1 className="text-5xl font-bold font-['Space_Mono'] uppercase mb-4 leading-tight">
                        CAMPUS EVENTS<br />ADMIN
                    </h1>
                    <p className="text-xl text-gray-600 mb-10">
                        Manage Clubs and Campus Events
                    </p>

                    {/* Features List */}
                    <div className="space-y-4">
                        {[
                            { icon: '🏢', text: 'Create and manage student clubs' },
                            { icon: '📅', text: 'Publish and organize campus events' },
                            { icon: '📊', text: 'Track registrations in real-time' },
                            { icon: '👥', text: 'View student participation data' },
                            { icon: '📧', text: 'Send notifications to participants' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <span className="text-3xl">{feature.icon}</span>
                                <span className="text-base text-gray-700">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Decoration */}
                    <div className="mt-16 pt-8 border-t border-gray-300">
                        <p className="text-sm text-gray-400 font-['Space_Mono'] uppercase tracking-widest">
                            Powered by SANKALAN Platform
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN - LOGIN FORM */}
            <div className="w-full lg:w-[40%] bg-white flex flex-col relative min-h-screen">

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute top-6 right-6 flex items-center gap-2 text-sm text-gray-600 hover:text-black transition font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={16} /> BACK
                </button>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center p-12">
                    <div className="w-full max-w-md">

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold font-['Space_Mono'] uppercase mb-2">
                                ADMIN LOGIN
                            </h2>
                            <p className="text-base text-gray-600">
                                Access the Events Management Dashboard
                            </p>
                        </div>

                        {/* Login Type Selector */}
                        <div className="flex border-[3px] border-black mb-8">
                            <button
                                onClick={() => handleTabSwitch('coordinator')}
                                className={`flex-1 h-[52px] font-['Space_Mono'] text-sm font-bold uppercase transition-all duration-200 ${loginType === 'coordinator'
                                    ? 'bg-black text-white'
                                    : 'bg-white text-black hover:bg-gray-100'
                                    } border-r-[3px] border-black`}
                            >
                                COORDINATOR
                            </button>
                            <button
                                onClick={() => handleTabSwitch('club')}
                                className={`flex-1 h-[52px] font-['Space_Mono'] text-sm font-bold uppercase transition-all duration-200 ${loginType === 'club'
                                    ? 'bg-black text-white'
                                    : 'bg-white text-black hover:bg-gray-100'
                                    }`}
                            >
                                CLUB PRESIDENT
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <AnimatePresence mode="wait">
                                {loginType === 'coordinator' ? (
                                    <motion.div
                                        key="coordinator"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Coordinator Email */}
                                        <div>
                                            <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                                COORDINATOR EMAIL
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="coordinator@college.edu"
                                                className="w-full h-[52px] border-[3px] border-gray-200 px-4 font-['Inter'] text-base focus:border-black focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="club"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Club ID */}
                                        <div>
                                            <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                                CLUB ID
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.clubId}
                                                onChange={(e) => setFormData({ ...formData, clubId: e.target.value })}
                                                placeholder="coding-club-2026"
                                                className="w-full h-[52px] border-[3px] border-gray-200 px-4 font-['Inter'] text-base focus:border-black focus:outline-none transition-colors"
                                            />
                                            <p className="text-xs text-gray-500 italic mt-2">
                                                Contact coordinator if you don't have Club ID
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                    {loginType === 'coordinator' ? 'PASSWORD' : 'CLUB PASSWORD'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter your password"
                                        className="w-full h-[52px] border-[3px] border-gray-200 px-4 pr-12 font-['Inter'] text-base focus:border-black focus:outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {loginType === 'club' && (
                                    <p className="text-xs text-orange-600 flex items-center gap-1 mt-2">
                                        <AlertTriangle size={12} />
                                        You'll be asked to change this on first login
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="w-5 h-5 border-2 border-black cursor-pointer"
                                />
                                <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-[56px] bg-black text-white border-[3px] border-black font-['Space_Mono'] text-sm font-bold uppercase hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        LOGGING IN...
                                    </>
                                ) : (
                                    'LOGIN TO DASHBOARD'
                                )}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-100 border-2 border-red-600 text-red-600 px-4 py-3 text-sm font-['Inter']"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </form>

                        {/* Bottom Links */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button className="text-sm text-gray-600 hover:text-black transition mb-4 block">
                                Forgot password? Contact coordinator
                            </button>
                            <button
                                onClick={onBack}
                                className="text-sm text-gray-600 hover:text-black transition flex items-center gap-2"
                            >
                                <ArrowLeft size={14} /> Back to Student Login
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsAdminLogin;
