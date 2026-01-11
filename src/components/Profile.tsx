
import React from 'react';
import { User, BookOpen, GraduationCap, Award, Calendar, Mail, MapPin, ArrowLeft } from 'lucide-react';
import useSound from '../hooks/useSound';

interface UserProfile {
    name: string;
    branch: string;
    year: string;
    semester: string;
    role: 'student' | 'admin';
}

const Profile: React.FC<{ profile: UserProfile; onBack: () => void }> = ({ profile, onBack }) => {
    const playClick = useSound();
    return (
        <div className="container mx-auto max-w-4xl">
            <button
                onClick={() => { playClick(); onBack(); }}
                className="mb-8 flex items-center gap-2 font-black uppercase hover:underline"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">
                Student Identity
            </h1>

            <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                {/* Decorative ID Number */}
                <div className="absolute top-4 right-4 text-xs font-black opacity-20 rotate-90 origin-top-right">
                    ID: MIT-ADT-2023-CSE-042
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-8 items-start border-b-4 border-black pb-10 mb-10">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-black border-4 border-black flex items-center justify-center shrink-0">
                        <User size={64} className="text-white" />
                    </div>

                    <div className="flex-1">
                        <div className="inline-block bg-black text-white px-3 py-1 text-xs font-black uppercase mb-2">
                            Status: Active
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                            {profile.name}
                        </h2>
                        <p className="text-xl font-bold uppercase text-gray-500 mb-6 flex items-center gap-2">
                            <GraduationCap size={24} /> {profile.branch} • Year {profile.year}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 border-2 border-black">
                                <Mail size={16} />
                                <span className="text-xs font-black uppercase">student@mitadt.ac.in</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 border-2 border-black">
                                <MapPin size={16} />
                                <span className="text-xs font-black uppercase">Pune, India</span>
                            </div>
                        </div>
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
