import React, { useState, useEffect } from 'react';
import { User, BookOpen, GraduationCap, Award, Calendar, Mail, MapPin, ArrowLeft, Edit2, Save, X } from 'lucide-react';
import useSound from '../hooks/useSound';

export interface UserProfile {
    name: string;
    branch: string;
    year: string;
    semester: string;
    role: 'student' | 'admin';
}

interface ProfileProps {
    profile: UserProfile;
    onBack: () => void;
    onUpdate: (updatedProfile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onBack, onUpdate }) => {
    const playClick = useSound();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>(profile);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleSave = () => {
        playClick();
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        playClick();
        setFormData(profile);
        setIsEditing(false);
    };

    const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT'];
    const years = ['1ST YEAR', '2ND YEAR', '3RD YEAR', '4TH YEAR'];

    // Helper function to get semesters based on year
    const getSemestersForYear = (year: string) => {
        switch (year) {
            case '1ST YEAR': return ['S1', 'S2'];
            case '2ND YEAR': return ['S3', 'S4'];
            case '3RD YEAR': return ['S5', 'S6'];
            case '4TH YEAR': return ['S7', 'S8'];
            default: return ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
        }
    };

    const availableSemesters = getSemestersForYear(formData.year);

    // Auto-adjust semester when year changes
    useEffect(() => {
        const validSemesters = getSemestersForYear(formData.year);
        if (!validSemesters.includes(formData.semester)) {
            setFormData(prev => ({ ...prev, semester: validSemesters[0] }));
        }
    }, [formData.year]);

    return (
        <div className="container mx-auto max-w-4xl pt-24 pb-12 px-4">
            <button
                onClick={() => { playClick(); onBack(); }}
                className="mb-8 flex items-center gap-2 font-black uppercase hover:underline"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="flex justify-between items-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                    Student Identity
                </h1>
                {!isEditing && (
                    <button
                        onClick={() => { playClick(); setIsEditing(true); }}
                        className="bg-black text-white px-6 py-3 font-black uppercase flex items-center gap-2 hover:bg-gray-800 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                    >
                        <Edit2 size={18} /> Edit Profile
                    </button>
                )}
            </div>

            <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                {/* Decorative ID Number */}
                <div className="absolute top-4 right-4 text-xs font-black opacity-20 rotate-90 origin-top-right">
                    ID: MIT-ADT-2023-{formData.branch}-042
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start border-b-4 border-black pb-10 mb-10">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-black border-4 border-black flex items-center justify-center shrink-0">
                        <User size={64} className="text-white" />
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                            <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black uppercase mb-2">
                                Status: Active
                            </div>
                            {isEditing && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 border-2 border-red-500 text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-500 text-white font-black uppercase flex items-center gap-2 border-2 border-black hover:bg-green-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        <Save size={18} /> Save
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-4 mt-2">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="text-3xl md:text-4xl font-black uppercase w-full border-b-4 border-black focus:outline-none focus:border-purple-600 bg-transparent"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Branch</label>
                                        <select
                                            value={formData.branch}
                                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                            className="w-full p-2 border-2 border-black font-bold uppercase"
                                        >
                                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Year</label>
                                        <select
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            className="w-full p-2 border-2 border-black font-bold uppercase"
                                        >
                                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Semester</label>
                                        <select
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            className="w-full p-2 border-2 border-black font-bold uppercase"
                                        >
                                            {availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                                    {profile.name}
                                </h2>
                                <p className="text-xl font-bold uppercase text-gray-500 mb-6 flex items-center gap-2">
                                    <GraduationCap size={24} /> {profile.branch} • {profile.year} • {profile.semester}
                                </p>
                            </>
                        )}

                        {!isEditing && (
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 border-2 border-black">
                                    <Mail size={16} />
                                    <span className="text-xs font-black uppercase">student@mitadt.ac.in</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 border-2 border-black">
                                    <MapPin size={16} />
                                    <span className="text-xs font-black uppercase">Pune, India</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black text-white p-6 border-4 border-black md:border-white">
                        <div className="flex justify-between items-start mb-4">
                            <BookOpen size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">PYQs</span>
                        </div>
                        <p className="text-4xl font-black">42</p>
                        <p className="text-xs uppercase opacity-70">Papers Solved</p>
                    </div>

                    <div className="bg-white p-6 border-4 border-black">
                        <div className="flex justify-between items-start mb-4">
                            <Award size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Rank</span>
                        </div>
                        <p className="text-4xl font-black">Top 10%</p>
                        <p className="text-xs uppercase opacity-70 text-gray-500">Class Performance</p>
                    </div>

                    <div className="bg-white p-6 border-4 border-black">
                        <div className="flex justify-between items-start mb-4">
                            <Calendar size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
                        </div>
                        <p className="text-4xl font-black">15 Days</p>
                        <p className="text-xs uppercase opacity-70 text-gray-500">Study Consistency</p>
                    </div>
                </div>

                {/* Footer Bar */}
                <div className="mt-10 pt-6 border-t-4 border-black flex justify-between items-end">
                    <div className="barcode h-8 w-48 bg-black opacity-20"></div>
                    <p className="text-[10px] font-black uppercase">Authorized Personnel Only</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
