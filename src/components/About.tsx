
import React from 'react';
import { Github, Linkedin, Heart, Code2, X, Star, Zap, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import pgImage from '../assets/pg.png';

const TEAM = [
    {
        name: 'Pranav Gawai',
        role: 'Lead Developer',
        image: pgImage,
        links: {
            github: 'https://github.com/pranavgawaii',
            linkedin: 'https://www.linkedin.com/in/pranavgawai/',
            twitter: 'https://x.com/pranavgawai_'
        }
    }
];

const About: React.FC = () => {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-12 relative">

            {/* Corner Star CTA - Professional & Wow */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-4 -right-2 md:top-0 md:right-0 z-20"
            >
                <a
                    href="https://github.com/pranavgawaii/sankalan-platform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-white text-black border-4 border-black px-5 py-3 shadow-[8px_8px_0px_0px_#111] hover:shadow-[12px_12px_0px_0px_#FFE500] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 font-black uppercase tracking-wider text-sm md:text-base cursor-pointer"
                >
                    <div className="relative">
                        <Star size={24} className="fill-gray-200 text-black group-hover:fill-yellow-400 group-hover:rotate-180 transition-all duration-500" strokeWidth={2} />
                        <div className="absolute inset-0 animate-ping opacity-20 bg-yellow-400 rounded-full group-hover:opacity-0"></div>
                    </div>
                    <span>Star On GitHub</span>
                </a>
            </motion.div>

            {/* Header / Mission */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-32 text-center pt-12"
            >
                <div className="relative inline-block mb-12">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute -top-12 -right-12 text-yellow-500 hidden md:block"
                    >
                        <Zap size={64} fill="currentColor" />
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none relative z-10">
                        We Kill <span className="underline decoration-8 decoration-black decoration-wavy text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-600 bg-[length:100%_100%]">Chaos.</span>
                    </h1>
                </div>

                <div className="max-w-3xl mx-auto bg-white text-black p-8 md:p-12 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform md:-rotate-1 hover:rotate-0 transition-transform duration-300">
                    <p className="text-xl md:text-2xl font-bold uppercase leading-relaxed font-mono">
                        "Sankalan was born out of frustration. scattered notes, last-minute panic, and shitty websites that track you. We built this to be the one-stop arsenal for every engineer at MIT-ADT."
                    </p>
                </div>
            </motion.div>

            {/* Values Grid */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black mb-32 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white"
            >
                <div className="p-10 border-b-4 md:border-b-0 md:border-r-4 border-black bg-yellow-300 group hover:bg-black hover:text-white transition-colors duration-300">
                    <h3 className="text-4xl font-black uppercase mb-4 flex items-center gap-2">
                        <span className="text-sm border-2 border-current rounded-full w-8 h-8 flex items-center justify-center">01</span> No Ads.
                    </h3>
                    <p className="font-bold uppercase text-sm tracking-wider leading-relaxed opacity-80 group-hover:opacity-100">We don't sell your attention. This platform is free and clean forever.</p>
                </div>
                <div className="p-10 border-b-4 md:border-b-0 md:border-r-4 border-black bg-cyan-300 group hover:bg-black hover:text-white transition-colors duration-300">
                    <h3 className="text-4xl font-black uppercase mb-4 flex items-center gap-2">
                        <span className="text-sm border-2 border-current rounded-full w-8 h-8 flex items-center justify-center">02</span> Open.
                    </h3>
                    <p className="font-bold uppercase text-sm tracking-wider leading-relaxed opacity-80 group-hover:opacity-100">Transparency is key. Our code is available on GitHub for you to audit.</p>
                </div>
                <div className="p-10 bg-pink-300 group hover:bg-black hover:text-white transition-colors duration-300">
                    <h3 className="text-4xl font-black uppercase mb-4 flex items-center gap-2">
                        <span className="text-sm border-2 border-current rounded-full w-8 h-8 flex items-center justify-center">03</span> Privacy.
                    </h3>
                    <p className="font-bold uppercase text-sm tracking-wider leading-relaxed opacity-80 group-hover:opacity-100">We don't track you. No cookies, no analytics, just pure utility.</p>
                </div>
            </motion.div>

            {/* Team */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-32"
            >
                <h2 className="text-5xl font-black uppercase tracking-tighter mb-16 flex items-center justify-center gap-4">
                    <span className="w-16 h-16 bg-black text-white flex items-center justify-center rounded-none border-4 border-black shadow-[4px_4px_0px_0px_#FFE500]">⚡</span>
                    The Builder
                </h2>

                <div className="flex justify-center">
                    {TEAM.map((member) => (
                        <div key={member.name} className="bg-white border-4 border-black p-0 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200 w-full max-w-lg group">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-8 flex justify-center items-center border-b-4 md:border-b-0 md:border-r-4 border-black bg-gray-50 group-hover:bg-yellow-100 transition-colors">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 rounded-full"></div>
                                        <img src={member.image} alt={member.name} className="relative w-32 h-32 rounded-full border-4 border-black bg-white object-cover" />
                                    </div>
                                </div>
                                <div className="p-8 text-left flex-1 bg-white">
                                    <h3 className="text-3xl font-black uppercase mb-2">{member.name}</h3>
                                    <p className="text-xs font-bold uppercase bg-black text-white inline-block px-3 py-1 mb-6">{member.role}</p>

                                    <div className="flex gap-4">
                                        {member.links.github && <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="p-2 border-4 border-black hover:bg-black hover:text-white hover:text-yellow-400 transition-colors"><Github size={20} strokeWidth={2.5} /></a>}
                                        {member.links.linkedin && <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 border-4 border-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"><Linkedin size={20} strokeWidth={2.5} /></a>}
                                        {member.links.twitter && <a href={member.links.twitter} target="_blank" rel="noopener noreferrer" className="p-2 border-4 border-black hover:bg-black hover:text-white hover:border-black transition-colors"><X size={20} strokeWidth={2.5} /></a>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Unique Footer: The Manifesto / Terminal */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="border-t-4 border-black pt-20 pb-20"
            >
                <div className="max-w-4xl mx-auto px-4 text-center md:text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-4xl font-black uppercase mb-6 leading-none">
                                Ready to <br />
                                <span className="bg-yellow-400 px-2">Ship?</span>
                            </h3>
                            <p className="font-bold text-lg mb-8 uppercase tracking-wide">
                                This project is open source. If you have an idea, a fix, or just want to break things, join us on GitHub.
                            </p>
                            <a href="https://github.com/pranavgawaii/sankalan-platform/issues" target="_blank" rel="noopener noreferrer" className="inline-block bg-black text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-black hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_#888] hover:shadow-[12px_12px_0px_0px_#FFE500]">
                                Contribute Code
                            </a>
                        </div>

                        {/* The Terminal */}
                        <div className="bg-black p-6 rounded-lg border-4 border-gray-800 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="font-mono text-sm text-green-400 space-y-2 text-left">
                                <p>{'>'} INITIALIZING_PROTOCOL...</p>
                                <p>{'>'} SYSTEM_STATUS: <span className="text-white">ONLINE</span></p>
                                <p>{'>'} ADS: <span className="text-red-500 line-through">DETECTED</span> <span className="text-white">BLOCKED</span></p>
                                <p>{'>'} TRACKERS: <span className="text-white">0</span></p>
                                <p>{'>'} MISSION: <span className="text-yellow-400">EMPOWER_STUDENTS</span></p>
                                <p className="animate-pulse">{'>'} _</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-24 text-center font-bold uppercase text-xs tracking-[0.2em] text-gray-400">
                    © 2026 Sankalan. Built for engineers, by engineers.
                </div>
            </motion.div>
        </div>
    );
};

const BookOpenIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);

export default About;
