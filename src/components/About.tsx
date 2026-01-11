
import React from 'react';
import { Github, Linkedin, Heart, Code2, X } from 'lucide-react';
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
        <div className="container mx-auto max-w-5xl">
            {/* Mission */}
            <div className="mb-24 text-center">
                <BookOpenIcon className="mx-auto w-16 h-16 mb-6" />
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
                    We Kill <span className="underline decoration-8 decoration-black decoration-wavy">Chaos.</span>
                </h1>
                <div className="max-w-3xl mx-auto bg-black text-white p-8 md:p-12 border-4 border-black shadow-[16px_16px_0px_0px_rgba(100,100,100,0.5)] transform -rotate-1">
                    <p className="text-xl md:text-2xl font-bold uppercase leading-relaxed font-mono">
                        "Sankalan was born out of frustration. scattered notes, last-minute panic, and shitty websites that track you. We built this to be the one-stop arsenal for every engineer at MIT-ADT."
                    </p>
                </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black mb-24">
                <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black bg-yellow-300">
                    <h3 className="text-3xl font-black uppercase mb-4">No Ads.</h3>
                    <p className="font-bold uppercase text-sm">We don't sell your attention. This platform is free and clean forever.</p>
                </div>
                <div className="p-8 border-b-4 md:border-b-0 md:border-r-4 border-black bg-cyan-300">
                    <h3 className="text-3xl font-black uppercase mb-4">Open Source.</h3>
                    <p className="font-bold uppercase text-sm">Transparency is key. Our code is available on GitHub for you to audit.</p>
                </div>
                <div className="p-8 bg-pink-300">
                    <h3 className="text-3xl font-black uppercase mb-4">Privacy 1st.</h3>
                    <p className="font-bold uppercase text-sm">We don't track you. No cookies, no analytics, just pure utility.</p>
                </div>
            </div>

            {/* Team */}
            <div className="mb-24">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
                    <span className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full text-2xl">⚡</span>
                    The Builder
                </h2>

                <div className="flex justify-center flex-wrap gap-8">
                    {TEAM.map((member) => (
                        <div key={member.name} className="bg-white border-4 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform w-full max-w-md">
                            <div className="bg-gray-100 border-b-4 border-black p-4 flex justify-center">
                                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full border-4 border-black bg-white" />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-black uppercase mb-1">{member.name}</h3>
                                <p className="text-xs font-bold uppercase bg-black text-white inline-block px-2 py-1 mb-4">{member.role}</p>

                                <div className="flex justify-center gap-4">
                                    {member.links.github && <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"><Github size={16} /></a>}
                                    {member.links.linkedin && <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"><Linkedin size={16} /></a>}
                                    {member.links.twitter && <a href={member.links.twitter} target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black hover:bg-black hover:text-white hover:border-black transition-colors"><X size={16} /></a>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="border-t-4 border-black pt-12 text-center pb-20">
                <p className="font-black uppercase tracking-widest text-gray-400 mb-8">Built with reliable tech</p>
                <div className="flex flex-wrap justify-center gap-4 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-2xl font-black">REACT</span>
                    <span className="text-2xl font-black">TYPESCRIPT</span>
                    <span className="text-2xl font-black">TAILWIND</span>
                    <span className="text-2xl font-black">FIREBASE</span>
                    <span className="text-2xl font-black">GEMINI</span>
                </div>
            </div>
        </div>
    );
};

const BookOpenIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);

export default About;
