import React, { useState } from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchClubs, addClub } from '../../lib/firestoreService';

interface ClubLoginProps {
    onLogin: (clubId: string) => void;
}

const ClubLogin: React.FC<ClubLoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. COORDINATOR BYPASS
        if (username === 'coordinator' && password === 'sankalan_admin') {
            onLogin('COORDINATOR_ACCESS');
            setLoading(false);
            return;
        }

        // 2. CLUB DEMO BYPASS
        if (username === 'coding_club' && password === 'password123') {
            onLogin('demo_club_id_123');
            setLoading(false);
            return;
        }

        try {
            const clubs = await fetchClubs();
            const club = clubs.find(c => c.username === username && c.password === password);

            if (club && club.id) {
                onLogin(club.id);
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('System error. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 p-8 w-full max-w-md shadow-sm"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-full">
                        <Shield size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-black font-['Space_Mono'] text-center uppercase mb-2">Club Portal</h2>
                <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">Authorized Access Only</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-bold focus:border-black outline-none transition-colors"
                            placeholder="club_handle"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-bold focus:border-black outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 font-bold text-center bg-red-50 p-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 font-black uppercase text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-4 text-center space-y-2">
                    <button
                        onClick={async () => {
                            setLoading(true);
                            // Simulating Demo Creation
                            setTimeout(() => {
                                alert('Demo Club Created! Login with: coding_club / password123');
                                setUsername('coding_club');
                                setPassword('password123');
                                setLoading(false);
                            }, 500);
                        }}
                        className="block w-full text-[10px] text-blue-600 font-bold uppercase hover:underline"
                    >
                        [DEV] Demo Club (President)
                    </button>

                    <button
                        onClick={() => {
                            setUsername('coordinator');
                            setPassword('sankalan_admin');
                        }}
                        className="block w-full text-[10px] text-red-600 font-bold uppercase hover:underline"
                    >
                        [DEV] Demo Coordinator (Main Admin)
                    </button>
                </div>

                <div className="mt-8 text-center pt-8 border-t border-gray-100">
                    <a href="/" className="text-[10px] text-gray-400 font-bold uppercase hover:text-black transition-colors">Return to Main Site</a>
                </div>
            </motion.div>
        </div>
    );
};

export default ClubLogin;
