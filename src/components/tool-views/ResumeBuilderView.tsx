import React, { useState, useRef } from 'react';
import { ArrowLeft, FileText, Download, Code, Plus, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResumeBuilderView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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

    const resumeRef = useRef<HTMLDivElement>(null);

    // --- Actions ---

    const handleDownloadPDF = async () => {
        if (!resumeRef.current) return;
        const canvas = await html2canvas(resumeRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Resume.pdf');
    };

    const handleDownloadLatex = () => {
        const latexCode = `
%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
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
\\input{glyphtounicode}

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

\\pdfgentounicode=1

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

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${formData.fullName}} \\\\ \\vspace{1pt}
    \\small ${formData.phone} $|$ \\href{mailto:${formData.email}}{\\underline{${formData.email}}} $|$ 
    \\href{https://${formData.linkedin}}{\\underline{${formData.linkedin}}} $|$
    \\href{https://${formData.github}}{\\underline{${formData.github}}}
\\end{center}

\\section{Education}
  \\resumeSubHeadingListStart
    ${formData.education.map(edu => `
    \\resumeSubheading
      {${edu.school}}{${edu.location}}
      {${edu.degree}}{${edu.date}}
    `).join('')}
  \\resumeSubHeadingListEnd

\\section{Experience}
  \\resumeSubHeadingListStart
    ${formData.experience.map(exp => `
    \\resumeSubheading
      {${exp.role}}{${exp.date}}
      {${exp.company}}{${exp.location}}
      \\resumeItemListStart
        ${exp.points.map(p => `\\resumeItem{${p}}`).join('\n        ')}
      \\resumeItemListEnd
    `).join('')}
  \\resumeSubHeadingListEnd

\\section{Projects}
    \\resumeSubHeadingListStart
      ${formData.projects.map(proj => `
      \\resumeProjectHeading
          {\\textbf{${proj.name}} $|$ \\emph{${proj.tech}}}{${proj.date}}
          \\resumeItemListStart
            ${proj.points.map(p => `\\resumeItem{${p}}`).join('\n            ')}
          \\resumeItemListEnd
      `).join('')}
    \\resumeSubHeadingListEnd

\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${formData.skills.languages}} \\\\
     \\textbf{Frameworks}{: ${formData.skills.frameworks}} \\\\
     \\textbf{Developer Tools}{: ${formData.skills.tools}} \\\\
     \\textbf{Libraries}{: ${formData.skills.libraries}}
    }}
 \\end{itemize}

\\end{document}
        `;

        const blob = new Blob([latexCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume.tex';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Render ---

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-xs font-black uppercase hover:underline">
                <ArrowLeft size={14} /> Back to Tools
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- Editor Side --- */}
                <div className="space-y-6 h-[85vh] overflow-y-auto pr-4 pb-20 editor-scrollbar">

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
                <div className="lg:sticky lg:top-24 h-fit">
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex-1 bg-black text-white px-4 py-3 text-xs font-black uppercase border-2 border-black hover:bg-gray-800 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            <Download size={14} /> Download PDF
                        </button>
                        <button
                            onClick={handleDownloadLatex}
                            className="flex-1 bg-white text-black px-4 py-3 text-xs font-black uppercase border-2 border-black hover:bg-gray-50 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            <Code size={14} /> Download .tex
                        </button>
                    </div>

                    {/* LIVE PREVIEW - SCALED TO FIT */}
                    <div className="border-4 border-gray-300 bg-gray-500/10 p-4 overflow-hidden flex justify-center">
                        {/* PREVIEW CONTAINER - Times New Roman */}
                        <div
                            ref={resumeRef}
                            className="bg-white text-black shadow-2xl origin-top transform scale-[0.6] md:scale-[0.7] lg:scale-[0.55] xl:scale-[0.65]"
                            style={{
                                width: '210mm',
                                minHeight: '297mm',
                                padding: '12.7mm', // 0.5in
                                fontFamily: '"Times New Roman", Times, serif'
                            }}
                        >

                            {/* Header */}
                            <div className="text-center mb-4">
                                <h1 className="text-4xl uppercase mb-1" style={{ fontVariant: 'small-caps' }}>{formData.fullName}</h1>
                                <div className="text-sm">
                                    {formData.phone} <span className="mx-1">|</span>
                                    <span className="underline">{formData.email}</span> <span className="mx-1">|</span>
                                    <span className="underline">{formData.linkedin}</span> <span className="mx-1">|</span>
                                    <span className="underline">{formData.github}</span>
                                </div>
                            </div>

                            {/* Section: Education */}
                            <div className="mb-4">
                                <h2 className="text-lg font-bold uppercase border-b border-black mb-2" style={{ fontVariant: 'small-caps' }}>Education</h2>
                                {formData.education.map((edu, i) => (
                                    <div key={i} className="mb-1">
                                        <div className="flex justify-between font-bold text-base">
                                            <span>{edu.school}</span>
                                            <span>{edu.location}</span>
                                        </div>
                                        <div className="flex justify-between italic text-sm">
                                            <span>{edu.degree}</span>
                                            <span>{edu.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Section: Experience */}
                            <div className="mb-4">
                                <h2 className="text-lg font-bold uppercase border-b border-black mb-2" style={{ fontVariant: 'small-caps' }}>Experience</h2>
                                {formData.experience.map((exp, i) => (
                                    <div key={i} className="mb-3">
                                        <div className="flex justify-between font-bold text-base">
                                            <span>{exp.role}</span>
                                            <span>{exp.date}</span>
                                        </div>
                                        <div className="flex justify-between italic text-sm mb-1">
                                            <span>{exp.company}</span>
                                            <span>{exp.location}</span>
                                        </div>
                                        <ul className="list-disc list-outside ml-5 text-sm space-y-0.5">
                                            {exp.points.map((pt, ptIdx) => (
                                                <li key={ptIdx}>{pt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Section: Projects */}
                            <div className="mb-4">
                                <h2 className="text-lg font-bold uppercase border-b border-black mb-2" style={{ fontVariant: 'small-caps' }}>Projects</h2>
                                {formData.projects.map((proj, i) => (
                                    <div key={i} className="mb-3">
                                        <div className="flex justify-between mb-1">
                                            <div className="text-base">
                                                <span className="font-bold">{proj.name}</span> <span>|</span> <span className="italic">{proj.tech}</span>
                                            </div>
                                            <span className="text-base">{proj.date}</span>
                                        </div>
                                        <ul className="list-disc list-outside ml-5 text-sm space-y-0.5">
                                            {proj.points.map((pt, ptIdx) => (
                                                <li key={ptIdx}>{pt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Section: Skills */}
                            <div className="mb-4">
                                <h2 className="text-lg font-bold uppercase border-b border-black mb-2" style={{ fontVariant: 'small-caps' }}>Technical Skills</h2>
                                <div className="text-sm">
                                    <div className="mb-1"><span className="font-bold">Languages:</span> {formData.skills.languages}</div>
                                    <div className="mb-1"><span className="font-bold">Frameworks:</span> {formData.skills.frameworks}</div>
                                    <div className="mb-1"><span className="font-bold">Developer Tools:</span> {formData.skills.tools}</div>
                                    <div><span className="font-bold">Libraries:</span> {formData.skills.libraries}</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilderView;
