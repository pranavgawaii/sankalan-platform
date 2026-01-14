import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Code, Plus, Trash2 } from 'lucide-react'; // Fixed imports

// --- Helper: Latex Escape ---
const escapeLatex = (str: string) => {
    if (!str) return '';
    return str
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde')
        .replace(/\^/g, '\\textasciicircum');
};

// --- Helper: Generate LaTeX Code (Jake Ryan Template) ---
const generateJakeRyanLatex = (formData: any) => {
    return `
%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Template By : Sankalan AI
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
% \\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(formData.fullName)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(formData.phone)} $|$ \\href{mailto:${formData.email}}{\\underline{${escapeLatex(formData.email)}}} $|$ 
    \\href{https://${formData.linkedin}}{\\underline{${escapeLatex(formData.linkedin)}}} $|$
    \\href{https://${formData.github}}{\\underline{${escapeLatex(formData.github)}}}
\\end{center}


\\section{Education}
  \\resumeSubHeadingListStart
    ${formData.education.map((edu: any) => `
    \\resumeSubheading
      {${escapeLatex(edu.school)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}}{${escapeLatex(edu.date)}}
    `).join('')}
  \\resumeSubHeadingListEnd


\\section{Experience}
  \\resumeSubHeadingListStart
    ${formData.experience.map((exp: any) => `
    \\resumeSubheading
      {${escapeLatex(exp.role)}}{${escapeLatex(exp.date)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
        ${exp.points.map((p: string) => `\\resumeItem{${escapeLatex(p)}}`).join('\n        ')}
      \\resumeItemListEnd
    `).join('')}
  \\resumeSubHeadingListEnd


\\section{Projects}
    \\resumeSubHeadingListStart
      ${formData.projects.map((proj: any) => `
      \\resumeProjectHeading
          {\\textbf{${escapeLatex(proj.name)}} $|$ \\emph{${escapeLatex(proj.tech)}}}{${escapeLatex(proj.date)}}
          \\resumeItemListStart
            ${proj.points.map((p: string) => `\\resumeItem{${escapeLatex(p)}}`).join('\n            ')}
          \\resumeItemListEnd
      `).join('')}
    \\resumeSubHeadingListEnd


\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${escapeLatex(formData.skills.languages)}} \\\\
     \\textbf{Frameworks}{: ${escapeLatex(formData.skills.frameworks)}} \\\\
     \\textbf{Developer Tools}{: ${escapeLatex(formData.skills.tools)}} \\\\
     \\textbf{Libraries}{: ${escapeLatex(formData.skills.libraries)}}
    }}
 \\end{itemize}

\\end{document}
`;
};

const ResumeBuilderView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [step, setStep] = useState<'selection' | 'editor'>('selection');
    const [template, setTemplate] = useState('jake');
    const [formData, setFormData] = useState({
        fullName: 'Jake Ryan',
        email: 'jake@su.edu',
        phone: '123-456-7890',
        linkedin: 'linkedin.com/in/jake',
        github: 'github.com/jake',
        education: [
            { school: 'Southwestern University', location: 'Georgetown, TX', degree: 'Bachelor of Arts in Computer Science, Minor in Business', date: 'Aug. 2018 -- May 2021' }
        ],
        experience: [
            {
                role: 'Undergraduate Research Assistant',
                company: 'Texas A&M University',
                location: 'College Station, TX',
                date: 'June 2020 -- Present',
                points: [
                    'Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems',
                    'Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data',
                    'Explored ways to visualize GitHub collaboration in a classroom setting'
                ]
            }
        ],
        projects: [
            {
                name: 'Gitlytics',
                tech: 'Python, Flask, React, PostgreSQL, Docker',
                date: 'June 2020 -- Present',
                points: [
                    'Developed a full-stack web application using with Flask serving a REST API with React as the frontend',
                    'Implemented GitHub OAuth to get data from user’s repositories',
                    'Visualized GitHub data to show collaboration',
                    'Used Celery and Redis for asynchronous tasks'
                ]
            }
        ],
        skills: {
            languages: 'Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R',
            frameworks: 'React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI',
            tools: 'Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse',
            libraries: 'pandas, NumPy, Matplotlib'
        }
    });

    const handleDownloadLatex = () => {
        const latexCode = generateJakeRyanLatex(formData);
        const blob = new Blob([latexCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume.tex';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    // --- Client-Side Preview Component (Jake Ryan) ---
    const JakeRyanPreview = ({ data }: { data: typeof formData }) => {
        return (
            <div className="w-full h-full bg-white text-black font-serif p-8 overflow-y-auto text-[10pt] leading-relaxed">
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-normal uppercase tracking-wide mb-1 opacity-90">{data.fullName}</h1>
                    <div className="flex justify-center gap-1 text-sm">
                        <span>{data.phone}</span>
                        <span>|</span>
                        <a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a>
                        <span>|</span>
                        <a href={`https://${data.linkedin}`} className="hover:underline">{data.linkedin}</a>
                        <span>|</span>
                        <a href={`https://${data.github}`} className="hover:underline">{data.github}</a>
                    </div>
                </div>

                {/* Education */}
                <div className="mb-4">
                    <h2 className="uppercase font-normal tracking-wider border-b border-black mb-2 text-sm opacity-80">Education</h2>
                    <ul className="list-none p-0 m-0">
                        {data.education.map((edu, i) => (
                            <li key={i} className="mb-1">
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{edu.school}</span>
                                    <span>{edu.location}</span>
                                </div>
                                <div className="flex justify-between italic text-sm">
                                    <span>{edu.degree}</span>
                                    <span>{edu.date}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Experience */}
                <div className="mb-4">
                    <h2 className="uppercase font-normal tracking-wider border-b border-black mb-2 text-sm opacity-80">Experience</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between font-bold text-sm">
                                <span>{exp.role}</span>
                                <span>{exp.date}</span>
                            </div>
                            <div className="flex justify-between italic text-sm mb-1">
                                <span>{exp.company}</span>
                                <span>{exp.location}</span>
                            </div>
                            <ul className="list-disc ml-5 space-y-0.5 text-sm">
                                {exp.points.map((pt, idx) => (
                                    <li key={idx} className="pl-1">{pt}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div className="mb-4">
                    <h2 className="uppercase font-normal tracking-wider border-b border-black mb-2 text-sm opacity-80">Projects</h2>
                    {data.projects.map((proj, i) => (
                        <div key={i} className="mb-2">
                            <div className="flex justify-between text-sm mb-0.5">
                                <div>
                                    <span className="font-bold">{proj.name}</span>
                                    <span className="mx-1">|</span>
                                    <span className="italic">{proj.tech}</span>
                                </div>
                                <span className="font-bold">{proj.date}</span>
                            </div>
                            <ul className="list-disc ml-5 space-y-0.5 text-sm">
                                {proj.points.map((pt, idx) => (
                                    <li key={idx} className="pl-1">{pt}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div>
                    <h2 className="uppercase font-normal tracking-wider border-b border-black mb-2 text-sm opacity-80">Technical Skills</h2>
                    <div className="text-sm">
                        <div className="flex mb-1"><span className="font-bold w-32 shrink-0">Languages:</span> <span>{data.skills.languages}</span></div>
                        <div className="flex mb-1"><span className="font-bold w-32 shrink-0">Frameworks:</span> <span>{data.skills.frameworks}</span></div>
                        <div className="flex mb-1"><span className="font-bold w-32 shrink-0">Developer Tools:</span> <span>{data.skills.tools}</span></div>
                        <div className="flex mb-1"><span className="font-bold w-32 shrink-0">Libraries:</span> <span>{data.skills.libraries}</span></div>
                    </div>
                </div>
            </div>
        );
    };

    const latexCode = generateJakeRyanLatex(formData);

    if (step === 'selection') {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button onClick={onBack} className="mb-6 flex items-center gap-2 text-xs font-black uppercase hover:underline">
                    <ArrowLeft size={14} /> Back to Tools
                </button>
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Choose Your Weapon</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-wide">Select a template to start building</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">
                    {/* Template 1: Jake Ryan */}
                    <div className="group cursor-pointer relative" onClick={() => { setTemplate('jake'); setStep('editor'); }}>

                        {/* Highlights/Badges */}
                        <div className="absolute -top-16 left-0 right-0 flex flex-col items-center gap-2 z-10 pointer-events-none">
                            <div className="bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 animate-bounce">
                                ✅ ATS Friendly
                            </div>
                            <div className="bg-black text-white text-[10px] font-black uppercase px-3 py-1 tracking-widest shadow-[4px_4px_0px_0px_#fbbf24] rotate-2 animate-pulse">
                                ⭐ Highly Recommended
                            </div>
                        </div>

                        <div className="border-4 border-black aspect-[3/4] bg-white relative mb-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[-4px] group-hover:translate-y-[-4px] transition-all overflow-hidden">
                            <img src="/jake-ryan.jpg" alt="Jake Ryan Resume Template" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                        </div>
                        <h3 className="text-xl font-black uppercase text-center">The Jake Ryan</h3>
                        <p className="text-xs text-center font-bold text-gray-400 uppercase tracking-widest mt-1">Classic • LaTeX • Strict</p>
                    </div>

                    {/* Template 2: Modern Tech (Coming Soon) */}
                    <div className="group relative cursor-not-allowed grayscale">
                        <div className="border-4 border-black aspect-[3/4] bg-white relative mb-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden opacity-60 flex items-center justify-center">
                            <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden pointer-events-none">
                                <div className="bg-white text-black font-black text-2xl px-8 py-3 rotate-6 border-4 border-black shadow-[8px_8px_0px_0px_#ef4444] animate-pulse skew-y-6 relative">
                                    IN PROGRESS
                                    <div className="absolute inset-0 bg-red-500 mix-blend-overlay opacity-30"></div>
                                </div>
                            </div>
                            <div className="p-4 scale-[0.3] origin-top h-[300%] w-[330%] pointer-events-none select-none font-sans blur-[2px]">
                                <div className="mb-4">
                                    <h1 className="text-5xl font-black uppercase mb-1">Jake Ryan</h1>
                                    <div className="text-sm text-gray-500 font-bold">SOFTWARE ENGINEER</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <div className="text-lg font-black uppercase mb-2 bg-black text-white inline-block px-1">Experience</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-black uppercase mb-2 text-right">Contact</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-black uppercase text-center text-gray-400">Modern Tech</h3>
                        <p className="text-xs text-center font-bold text-gray-300 uppercase tracking-widest mt-1">Bold • Clean • Sans-Serif</p>
                    </div>

                    {/* Template 3: Minimalist (Coming Soon) */}
                    <div className="group relative cursor-not-allowed grayscale">
                        <div className="border-4 border-black aspect-[3/4] bg-white relative mb-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden opacity-60 flex items-center justify-center">
                            <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden pointer-events-none">
                                <div className="bg-white text-black font-black text-2xl px-8 py-3 rotate-6 border-4 border-black shadow-[8px_8px_0px_0px_#ef4444] animate-pulse skew-y-6 relative">
                                    IN PROGRESS
                                    <div className="absolute inset-0 bg-red-500 mix-blend-overlay opacity-30"></div>
                                </div>
                            </div>
                            <div className="p-4 scale-[0.3] origin-top h-[300%] w-[330%] pointer-events-none select-none font-mono blur-[2px]">
                                <div className="text-center border-b-2 border-black pb-4 mb-4">
                                    <h1 className="text-4xl font-bold mb-1">JAKE.RYAN</h1>
                                    <div className="text-xs tracking-widest">FULL STACK DEVELOPER</div>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-black uppercase text-center text-gray-400">The Minimalist</h3>
                        <p className="text-xs text-center font-bold text-gray-300 uppercase tracking-widest mt-1">Simple • Mono • Code-like</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setStep('selection')} className="flex items-center gap-2 text-xs font-black uppercase hover:underline">
                    <ArrowLeft size={14} /> Back to Templates
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="bg-black text-white w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        title="Download PDF"
                    >
                        <Download size={18} />
                    </button>
                    <button
                        onClick={handleDownloadLatex}
                        className="bg-white text-black w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        title="Download .tex Code"
                    >
                        <Code size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]">

                {/* --- Editor Side --- */}
                <div className="space-y-6 h-full overflow-y-auto pr-4 pb-20 editor-scrollbar">

                    {/* Personal Info */}
                    <div className="bg-white border-4 border-black p-6 shadow-md">
                        <h3 className="font-black uppercase text-sm mb-4">Personal Info</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <input value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="border-2 border-black p-2 text-sm font-bold" placeholder="Full Name" />
                            <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="border-2 border-black p-2 text-sm" placeholder="Email" />
                            <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="border-2 border-black p-2 text-sm" placeholder="Phone" />
                            <div className="col-span-2 grid grid-cols-2 gap-3">
                                <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="border-2 border-black p-2 text-sm" placeholder="LinkedIn (e.g. linkedin.com/in/jake)" />
                                <input value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} className="border-2 border-black p-2 text-sm" placeholder="GitHub (e.g. github.com/jake)" />
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-white border-4 border-black p-6 shadow-md">
                        <h3 className="font-black uppercase text-sm mb-4">Education</h3>
                        {formData.education.map((edu, i) => (
                            <div key={i} className="mb-4 border-b-2 border-gray-200 pb-4 last:border-0 last:pb-0">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input value={edu.school} onChange={e => {
                                        const newEdu = [...formData.education]; newEdu[i].school = e.target.value; setFormData({ ...formData, education: newEdu });
                                    }} className="border-2 border-black p-2 text-xs font-bold" placeholder="University" />
                                    <input value={edu.location} onChange={e => {
                                        const newEdu = [...formData.education]; newEdu[i].location = e.target.value; setFormData({ ...formData, education: newEdu });
                                    }} className="border-2 border-black p-2 text-xs" placeholder="Location" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input value={edu.degree} onChange={e => {
                                        const newEdu = [...formData.education]; newEdu[i].degree = e.target.value; setFormData({ ...formData, education: newEdu });
                                    }} className="border-2 border-black p-2 text-xs" placeholder="Degree" />
                                    <input value={edu.date} onChange={e => {
                                        const newEdu = [...formData.education]; newEdu[i].date = e.target.value; setFormData({ ...formData, education: newEdu });
                                    }} className="border-2 border-black p-2 text-xs" placeholder="Date" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Experience */}
                    <div className="bg-white border-4 border-black p-6 shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black uppercase text-sm">Experience</h3>
                            <button className="text-xs bg-black text-white px-2 py-1 flex items-center gap-1 font-bold" onClick={() => setFormData({ ...formData, experience: [...formData.experience, { role: 'Role', company: 'Company', location: 'Location', date: 'Date', points: ['Did something cool'] }] })}>
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        {formData.experience.map((exp, i) => (
                            <div key={i} className="mb-6 border-l-4 border-black pl-4">
                                <div className="flex justify-end mb-2">
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                        const newExp = [...formData.experience]; newExp.splice(i, 1); setFormData({ ...formData, experience: newExp });
                                    }}><Trash2 size={14} /></button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input value={exp.role} onChange={e => {
                                        const newExp = [...formData.experience]; newExp[i].role = e.target.value; setFormData({ ...formData, experience: newExp });
                                    }} className="border-2 border-black p-2 text-xs font-bold" placeholder="Role" />
                                    <input value={exp.date} onChange={e => {
                                        const newExp = [...formData.experience]; newExp[i].date = e.target.value; setFormData({ ...formData, experience: newExp });
                                    }} className="border-2 border-black p-2 text-xs" placeholder="Date" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input value={exp.company} onChange={e => {
                                        const newExp = [...formData.experience]; newExp[i].company = e.target.value; setFormData({ ...formData, experience: newExp });
                                    }} className="border-2 border-black p-2 text-xs" placeholder="Company" />
                                    <input value={exp.location} onChange={e => {
                                        const newExp = [...formData.experience]; newExp[i].location = e.target.value; setFormData({ ...formData, experience: newExp });
                                    }} className="border-2 border-black p-2 text-xs" placeholder="Location" />
                                </div>
                                <div className="space-y-2">
                                    {exp.points.map((pt, ptIdx) => (
                                        <div key={ptIdx} className="flex gap-2">
                                            <span className="text-lg leading-none">•</span>
                                            <input value={pt} onChange={e => {
                                                const newExp = [...formData.experience]; newExp[i].points[ptIdx] = e.target.value; setFormData({ ...formData, experience: newExp });
                                            }} className="border-b border-gray-300 w-full text-xs focus:outline-none focus:border-black" />
                                        </div>
                                    ))}
                                    <button className="text-[10px] font-bold text-blue-600 hover:underline ml-4" onClick={() => {
                                        const newExp = [...formData.experience]; newExp[i].points.push('New bullet point'); setFormData({ ...formData, experience: newExp });
                                    }}>+ Add Point</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Projects */}
                    <div className="bg-white border-4 border-black p-6 shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black uppercase text-sm">Projects</h3>
                            <button className="text-xs bg-black text-white px-2 py-1 flex items-center gap-1 font-bold" onClick={() => setFormData({ ...formData, projects: [...formData.projects, { name: 'Project', tech: 'Tech Stack', date: 'Date', points: ['Feature 1'] }] })}>
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        {formData.projects.map((proj, i) => (
                            <div key={i} className="mb-6 border-l-4 border-black pl-4">
                                <div className="flex justify-end mb-2">
                                    <button className="text-red-500 hover:text-red-700" onClick={() => {
                                        const newProj = [...formData.projects]; newProj.splice(i, 1); setFormData({ ...formData, projects: newProj });
                                    }}><Trash2 size={14} /></button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                    <input value={proj.name} onChange={e => {
                                        const newProj = [...formData.projects]; newProj[i].name = e.target.value; setFormData({ ...formData, projects: newProj });
                                    }} className="border-2 border-black p-2 text-xs font-bold" placeholder="Project Name" />
                                    <input value={proj.tech} onChange={e => {
                                        const newProj = [...formData.projects]; newProj[i].tech = e.target.value; setFormData({ ...formData, projects: newProj });
                                    }} className="border-2 border-black p-2 text-xs col-span-2" placeholder="Tech Stack" />
                                </div>
                                <div className="space-y-2">
                                    {proj.points.map((pt, ptIdx) => (
                                        <div key={ptIdx} className="flex gap-2">
                                            <span className="text-lg leading-none">•</span>
                                            <input value={pt} onChange={e => {
                                                const newProj = [...formData.projects]; newProj[i].points[ptIdx] = e.target.value; setFormData({ ...formData, projects: newProj });
                                            }} className="border-b border-gray-300 w-full text-xs focus:outline-none focus:border-black" />
                                        </div>
                                    ))}
                                    <button className="text-[10px] font-bold text-blue-600 hover:underline ml-4" onClick={() => {
                                        const newProj = [...formData.projects]; newProj[i].points.push('New feature'); setFormData({ ...formData, projects: newProj });
                                    }}>+ Add Point</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="bg-white border-4 border-black p-6 shadow-md">
                        <h3 className="font-black uppercase text-sm mb-4">Technical Skills</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold block">Languages</label>
                                <input value={formData.skills.languages} onChange={e => setFormData({ ...formData, skills: { ...formData.skills, languages: e.target.value } })} className="border-2 border-black w-full p-2 text-xs" />
                            </div>
                            <div>
                                <label className="text-xs font-bold block">Frameworks</label>
                                <input value={formData.skills.frameworks} onChange={e => setFormData({ ...formData, skills: { ...formData.skills, frameworks: e.target.value } })} className="border-2 border-black w-full p-2 text-xs" />
                            </div>
                            <div>
                                <label className="text-xs font-bold block">Developer Tools</label>
                                <input value={formData.skills.tools} onChange={e => setFormData({ ...formData, skills: { ...formData.skills, tools: e.target.value } })} className="border-2 border-black w-full p-2 text-xs" />
                            </div>
                            <div>
                                <label className="text-xs font-bold block">Libraries</label>
                                <input value={formData.skills.libraries} onChange={e => setFormData({ ...formData, skills: { ...formData.skills, libraries: e.target.value } })} className="border-2 border-black w-full p-2 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Preview Side (Sticky) --- */}
                <div className="lg:sticky lg:top-24 h-full flex flex-col">
                    {/* LIVE HTML PREVIEW */}
                    <div className="border-4 border-black bg-gray-100 flex-1 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <div className="absolute inset-0 p-8 overflow-y-auto bg-gray-500/10">
                            <div className="max-w-[210mm] mx-auto min-h-[297mm] shadow-2xl origin-top sm:scale-100 scale-75">
                                <JakeRyanPreview data={formData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Hidden Print Area --- */}
            <div id="printable-area" className="hidden print:block fixed inset-0 bg-white z-[9999]">
                <JakeRyanPreview data={formData} />
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #printable-area, #printable-area * {
                        visibility: visible;
                    }
                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: auto;
                        margin: 0;
                        padding: 0;
                        background: white;
                        display: block !important;
                    }
                    /* Override scroll/height for printing */
                    #printable-area > div { 
                        height: auto !important; 
                        overflow: visible !important; 
                        width: 100% !important;
                    }
                    @page {
                        margin: 0;
                        size: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default ResumeBuilderView;
