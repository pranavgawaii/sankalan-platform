import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CreateClubModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormData {
    clubName: string;
    clubId: string;
    clubLogo: string;
    category: string;
    description: string;
    presidentName: string;
    presidentEmail: string;
    presidentPhone: string;
    initialPassword: string;
}

const CreateClubModal: React.FC<CreateClubModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState<FormData>({
        clubName: '',
        clubId: '',
        clubLogo: '🏢',
        category: '',
        description: '',
        presidentName: '',
        presidentEmail: '',
        presidentPhone: '',
        initialPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Auto-generate club ID from club name
    const generateClubId = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() + '-2026';
    };

    const handleClubNameBlur = () => {
        if (formData.clubName && !formData.clubId) {
            setFormData({ ...formData, clubId: generateClubId(formData.clubName) });
        }
    };

    const validateForm = () => {
        if (!formData.clubName.trim()) return false;
        if (!formData.clubId.trim()) return false;
        if (!formData.category) return false;
        if (!formData.presidentName.trim()) return false;
        if (!formData.presidentEmail.trim()) return false;
        if (!formData.initialPassword || formData.initialPassword.length < 8) return false;
        if (!isConfirmed) return false;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.presidentEmail)) return false;

        // Password validation
        const hasUpperCase = /[A-Z]/.test(formData.initialPassword);
        const hasLowerCase = /[a-z]/.test(formData.initialPassword);
        const hasNumber = /[0-9]/.test(formData.initialPassword);
        if (!hasUpperCase || !hasLowerCase || !hasNumber) return false;

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 1. Create auth user for president using admin API (bypasses email confirmation)
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: formData.presidentEmail,
                password: formData.initialPassword,
                email_confirm: true, // Skip email confirmation
                user_metadata: {
                    name: formData.presidentName,
                    role: 'club_president'
                }
            });

            if (authError) throw authError;

            // 2. Create club record
            const { data: clubData, error: clubError } = await supabase
                .from('clubs')
                .insert([
                    {
                        club_id: formData.clubId,
                        club_name: formData.clubName,
                        club_logo: formData.clubLogo,
                        category: formData.category,
                        description: formData.description,
                        president_name: formData.presidentName,
                        president_email: formData.presidentEmail,
                        president_phone: formData.presidentPhone,
                        president_user_id: authData.user?.id,
                        status: 'Active', // IMPORTANT: Must be capitalized 'Active'
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (clubError) throw clubError;

            // Success!
            onSuccess();
            onClose();

            // Reset form
            setFormData({
                clubName: '',
                clubId: '',
                clubLogo: '🏢',
                category: '',
                description: '',
                presidentName: '',
                presidentEmail: '',
                presidentPhone: '',
                initialPassword: ''
            });
            setIsConfirmed(false);
        } catch (err: any) {
            setError(err.message || 'Failed to create club. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
            setError('');
        }
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, isLoading]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center font-['Inter']">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/70"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-[700px] max-h-[90vh] bg-white border-[6px] border-black shadow-[12px_12px_0px_black] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-black px-8 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🏢</span>
                            <h2 className="text-2xl font-bold font-['Space_Mono'] uppercase text-white">
                                CREATE NEW CLUB
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="text-white hover:text-gray-300 transition disabled:opacity-50"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 bg-red-100 border-2 border-red-600 text-red-600 px-4 py-3 text-sm">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Section 1: Club Information */}
                        <div className="mb-8">
                            <div className="text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 pb-2 border-b-2 border-gray-200 mb-5">
                                CLUB INFORMATION
                            </div>

                            <div className="space-y-5">
                                {/* Club Name */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        CLUB NAME *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.clubName}
                                        onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                                        onBlur={handleClubNameBlur}
                                        placeholder="e.g., Coding Club, Drama Society"
                                        className="w-full h-12 border-2 border-gray-200 px-4 text-sm focus:border-blue-600 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* Club ID */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        CLUB ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.clubId}
                                        onChange={(e) => setFormData({ ...formData, clubId: e.target.value.toLowerCase() })}
                                        placeholder="coding-club-2026 (no spaces, lowercase)"
                                        pattern="[a-z0-9-]+"
                                        className="w-full h-12 border-2 border-gray-200 px-4 text-sm focus:border-blue-600 focus:outline-none"
                                        required
                                    />
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Used for president login. Auto-generated from name but can edit.
                                    </p>
                                </div>

                                {/* Club Logo */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        CLUB LOGO (EMOJI)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="text-6xl">{formData.clubLogo}</div>
                                        <input
                                            type="text"
                                            value={formData.clubLogo}
                                            onChange={(e) => setFormData({ ...formData, clubLogo: e.target.value })}
                                            placeholder="Click to select emoji"
                                            className="flex-1 h-12 border-2 border-gray-200 px-4 text-sm focus:border-blue-600 focus:outline-none"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        CATEGORY *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-12 border-2 border-gray-200 px-4 text-sm focus:border-blue-600 focus:outline-none"
                                        required
                                    >
                                        <option value="">Select category...</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Arts">Arts</option>
                                        <option value="Social Service">Social Service</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        DESCRIPTION
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the club's mission and activities..."
                                        maxLength={500}
                                        className="w-full h-24 border-2 border-gray-200 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none resize-none"
                                    />
                                    <p className="text-[11px] text-gray-500 text-right mt-1">
                                        {formData.description.length}/500
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: President Details */}
                        <div className="mb-8">
                            <div className="text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 pb-2 border-b-2 border-gray-200 mb-5">
                                ASSIGN CLUB PRESIDENT
                            </div>

                            <div className="space-y-5">
                                {/* President Name */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        PRESIDENT NAME *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.presidentName}
                                        onChange={(e) => setFormData({ ...formData, presidentName: e.target.value })}
                                        placeholder="Full name of the club president"
                                        className="w-full h-12 border-2 border-gray-200 px-4 text-sm focus:border-blue-600 focus:outline-none"
                                        required
                                    />
                                </div>

                                {/* President Email */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        PRESIDENT EMAIL *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.presidentEmail}
                                        onChange={(e) => setFormData({ ...formData, presidentEmail: e.target.value })}
                                        placeholder="president@college.edu"
                                        className="w-full h-12 border-2 border-gray-200 px-4 text-sm focus:border-blue-600 focus:outline-none"
                                        required
                                    />
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Used for login. President will receive credentials.
                                    </p>
                                </div>

                                {/* President Phone */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        PRESIDENT PHONE
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.presidentPhone}
                                        onChange={(e) => setFormData({ ...formData, presidentPhone: e.target.value })}
                                        placeholder="+91-9876543210"
                                        className="w-full h-12 border-2 border-gray-200 px-4 text-sm focus:border-blue-600 focus:outline-none"
                                    />
                                </div>

                                {/* Initial Password */}
                                <div>
                                    <label className="block text-xs font-['Space_Mono'] uppercase font-bold text-gray-700 mb-2">
                                        INITIAL PASSWORD *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.initialPassword}
                                            onChange={(e) => setFormData({ ...formData, initialPassword: e.target.value })}
                                            placeholder="Create secure password (min 8 characters)"
                                            minLength={8}
                                            className="w-full h-12 border-2 border-gray-200 px-4 pr-12 text-sm focus:border-blue-600 focus:outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-orange-600 mt-1 flex items-center gap-1">
                                        ⚠️ President must change this on first login
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Confirmation */}
                        <div className="mb-6">
                            <div className="bg-blue-50 border-2 border-blue-600 p-4 rounded-lg mb-4">
                                <div className="flex items-start gap-3">
                                    <Info size={20} className="text-blue-600 mt-0.5" />
                                    <p className="text-sm text-gray-700">
                                        After creating the club, an email will be sent to the president with login credentials and instructions.
                                    </p>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isConfirmed}
                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                    className="w-5 h-5 border-2 border-blue-600 mt-0.5 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700">
                                    I confirm the details are correct and want to create this club
                                </span>
                            </label>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 border-t-2 border-gray-200 px-8 py-6 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-8 h-12 border-2 border-gray-200 bg-white text-gray-700 font-['Space_Mono'] text-sm font-bold uppercase hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!validateForm() || isLoading}
                            className="px-10 h-12 bg-black text-white font-['Space_Mono'] text-sm font-bold uppercase hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    CREATING...
                                </>
                            ) : (
                                'CREATE CLUB'
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateClubModal;
