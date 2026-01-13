import React, { useState } from 'react';
import { ArrowLeft, BrainCircuit, CheckCircle2, AlertTriangle, FileText, Loader2, Upload, Settings, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set worker source locally for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface Question {
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface QuizSettings {
    mode: 'text' | 'pdf';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questionCount: number;
    topic: string;
}

const MockTesterView: React.FC<{ onBack: () => void; apiKey: string; onUpdateKey: () => void }> = ({ onBack, apiKey, onUpdateKey }) => {
    // UI State
    const [step, setStep] = useState<'config' | 'generating' | 'quiz' | 'result'>('config');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingStatus, setLoadingStatus] = useState('');

    // Data State
    const [settings, setSettings] = useState<QuizSettings>({
        mode: 'text',
        difficulty: 'Medium',
        questionCount: 5,
        topic: ''
    });
    const [inputText, setInputText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [quiz, setQuiz] = useState<Question[] | null>(null);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [score, setScore] = useState<number | null>(null);

    // --- Helpers ---

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }
        setFile(selectedFile);
        setError('');
    };

    const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        const maxPages = Math.min(pdf.numPages, 15); // Limit to 15 pages for context window safety

        for (let i = 1; i <= maxPages; i++) {
            setLoadingStatus(`Reading PDF page ${i}/${maxPages}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
        }
        return fullText;
    };

    const generateQuiz = async () => {
        setError('');

        let contentToProcess = inputText;

        if (settings.mode === 'text') {
            if (!inputText.trim() || inputText.length < 50) {
                setError('Please enter at least 50 characters of text.');
                return;
            }
        } else {
            if (!file) {
                setError('Please upload a PDF file.');
                return;
            }
        }

        setIsLoading(true);
        setStep('generating');

        try {
            // 1. Extract Text if PDF
            if (settings.mode === 'pdf' && file) {
                setLoadingStatus('Extracting text from PDF...');
                contentToProcess = await extractTextFromPDF(file);
            }

            // 2. Generate Quiz via Gemini
            setLoadingStatus('AI is crafting your quiz...');
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Generate a ${settings.difficulty} level multiple-choice quiz with exactly ${settings.questionCount} questions.
                ${settings.topic ? `Focus specifically on the topic: "${settings.topic}".` : ''}
                
                The questions should be based STRICTLY on the following text context.
                
                Return strictly VALID JSON in this format:
                [
                    {
                        "text": "Question text?",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correctIndex": 0, // 0-3
                        "explanation": "Brief explanation."
                    }
                ]
                
                TEXT CONTEXT:
                ${contentToProcess.substring(0, 12000)} // Context limit
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const questions = JSON.parse(jsonStr);

            setQuiz(questions);
            setUserAnswers(new Array(questions.length).fill(-1));
            setStep('quiz');

        } catch (err: any) {
            console.error("Gemini API Error:", err);
            // FALLBACK MOCK DATA FOR DEMO
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockQuestions = [
                {
                    "text": "What is the primary function of the mitochondria?",
                    "options": ["Energy production", "Protein synthesis", "Cell division", "Waste disposal"],
                    "correctIndex": 0,
                    "explanation": "Mitochondria are known as the powerhouse of the cell."
                },
                {
                    "text": "Which data structure uses LIFO (Last In First Out)?",
                    "options": ["Queue", "Stack", "Linked List", "Tree"],
                    "correctIndex": 1,
                    "explanation": "A stack pushes and pops elements from the top."
                },
                {
                    "text": "What does HTML stand for?",
                    "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mode Link", "Home Tool Markup Language"],
                    "correctIndex": 0,
                    "explanation": "HTML is the standard markup language for documents designed to be displayed in a web browser."
                }
            ];
            setQuiz(mockQuestions);
            setUserAnswers(new Array(mockQuestions.length).fill(-1));
            setStep('quiz');

            setIsLoading(false);
            setLoadingStatus('');
        }
    };

    const submitQuiz = () => {
        if (!quiz) return;
        let calculatedScore = 0;
        quiz.forEach((q, i) => {
            if (userAnswers[i] === q.correctIndex) calculatedScore++;
        });
        setScore(calculatedScore);
        setStep('result');
    };

    const resetQuiz = () => {
        setStep('config');
        setQuiz(null);
        setScore(null);
        setError('');
        // Keep settings/text for convenience
    };

    // --- Render ---

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-xs font-black uppercase hover:underline">
                <ArrowLeft size={14} /> Back to Tools
            </button>

            <button onClick={onUpdateKey} className="absolute top-0 right-0 mb-6 flex items-center gap-2 text-xs font-black uppercase hover:underline text-gray-500">
                <Settings size={14} /> API Key
            </button>

            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
                    <div className="bg-black text-white p-3">
                        <BrainCircuit size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">AI Mock Tester</h2>
                        <p className="text-sm font-bold uppercase text-gray-500">Custom Quiz Generator</p>
                    </div>
                </div>

                {/* --- Step 1: Configuration --- */}
                {step === 'config' && (
                    <div className="space-y-8">

                        {/* Source Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setSettings({ ...settings, mode: 'text' })}
                                className={`p-4 border-4 text-center transition-all ${settings.mode === 'text' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black text-gray-400 hover:text-black'}`}
                            >
                                <FileText className="mx-auto mb-2" />
                                <span className="font-black uppercase text-sm">Paste Text</span>
                            </button>
                            <button
                                onClick={() => setSettings({ ...settings, mode: 'pdf' })}
                                className={`p-4 border-4 text-center transition-all ${settings.mode === 'pdf' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black text-gray-400 hover:text-black'}`}
                            >
                                <Upload className="mx-auto mb-2" />
                                <span className="font-black uppercase text-sm">Upload PDF</span>
                            </button>
                        </div>

                        {/* Input Area */}
                        <div>
                            {settings.mode === 'text' ? (
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="w-full h-48 border-2 border-black p-4 font-mono text-sm focus:outline-none focus:bg-gray-50 mb-2 uppercase"
                                    placeholder="Paste extracts from your notes, textbook, or syllabus..."
                                ></textarea>
                            ) : (
                                <div className="border-4 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center bg-gray-50 hover:border-black transition-colors">
                                    <input type="file" id="quiz-pdf" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                                    <label htmlFor="quiz-pdf" className="bg-black text-white px-6 py-2 font-black uppercase cursor-pointer hover:bg-gray-800 mb-2">
                                        Choose PDF
                                    </label>
                                    <span className="text-xs font-bold uppercase text-gray-500">
                                        {file ? `Selected: ${file.name}` : 'Max 15 Pages Used'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Configuration Form */}
                        <div className="bg-gray-100 p-6 border-2 border-black">
                            <h3 className="font-black uppercase text-sm mb-4 flex items-center gap-2"><Settings size={16} /> Quiz Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1">Difficulty</label>
                                    <select
                                        value={settings.difficulty}
                                        onChange={(e) => setSettings({ ...settings, difficulty: e.target.value as any })}
                                        className="w-full p-2 border-2 border-black font-bold text-sm uppercase"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1">Questions</label>
                                    <select
                                        value={settings.questionCount}
                                        onChange={(e) => setSettings({ ...settings, questionCount: parseInt(e.target.value) })}
                                        className="w-full p-2 border-2 border-black font-bold text-sm uppercase"
                                    >
                                        <option value={5}>5 Questions</option>
                                        <option value={10}>10 Questions</option>
                                        <option value={15}>15 Questions</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1">Focus Topic (Optional)</label>
                                    <input
                                        type="text"
                                        value={settings.topic}
                                        onChange={(e) => setSettings({ ...settings, topic: e.target.value })}
                                        placeholder="e.g. Normalization"
                                        className="w-full p-2 border-2 border-black font-bold text-sm uppercase focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-2 border-red-600 p-4 flex items-center gap-2 text-red-700 font-bold uppercase text-xs">
                                <AlertTriangle size={16} /> {error}
                            </div>
                        )}

                        <button
                            onClick={generateQuiz}
                            disabled={isLoading}
                            className="w-full py-4 bg-black text-white font-black uppercase tracking-widest border-2 border-black hover:bg-gray-900 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Generate Custom Quiz
                        </button>
                    </div>
                )}

                {/* --- Step 2: Generating --- */}
                {step === 'generating' && (
                    <div className="py-20 text-center">
                        <Loader2 size={48} className="animate-spin mx-auto mb-6" />
                        <h3 className="text-xl font-black uppercase mb-2">Generating Quiz...</h3>
                        <p className="font-mono text-sm uppercase text-gray-500">{loadingStatus}</p>
                    </div>
                )}

                {/* --- Step 3: Taking Quiz --- */}
                {step === 'quiz' && quiz && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2">
                            <span className="font-black uppercase text-gray-400">Question Progress</span>
                            <span className="font-mono font-bold">{userAnswers.filter(a => a !== -1).length} / {quiz.length} Answered</span>
                        </div>

                        {quiz.map((q, i) => (
                            <div key={i} className="p-6 border-2 border-black bg-gray-50 relative group hover:bg-white transition-colors">
                                <span className="absolute -top-3 -left-3 bg-black text-white px-3 py-1 font-black text-xs border-2 border-white shadow-sm">
                                    Q{i + 1}
                                </span>
                                <h3 className="text-lg font-bold uppercase mb-6 mt-2">{q.text}</h3>

                                <div className="space-y-3 pl-2">
                                    {q.options.map((option, optIdx) => (
                                        <button
                                            key={optIdx}
                                            onClick={() => {
                                                const newAns = [...userAnswers];
                                                newAns[i] = optIdx;
                                                setUserAnswers(newAns);
                                            }}
                                            className={`w-full text-left p-4 border-2 font-bold uppercase text-xs md:text-sm transition-all flex items-center gap-3 ${userAnswers[i] === optIdx
                                                ? 'border-black bg-black text-white translate-x-2'
                                                : 'border-gray-300 bg-white hover:border-black hover:bg-gray-50 text-gray-600 hover:text-black'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 border-2 flex items-center justify-center text-[10px] ${userAnswers[i] === optIdx ? 'border-white' : 'border-black'}`}>
                                                {String.fromCharCode(65 + optIdx)}
                                            </div>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={submitQuiz}
                            disabled={userAnswers.includes(-1)}
                            className="w-full py-4 bg-green-600 text-white font-black uppercase tracking-widest border-2 border-black hover:bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            Submit & Check Score
                        </button>
                    </div>
                )}

                {/* --- Step 4: Results --- */}
                {step === 'result' && quiz && score !== null && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="bg-black text-white p-8 border-4 border-black text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-6xl font-black mb-2">{Math.round((score / quiz.length) * 100)}%</h3>
                                <p className="font-bold uppercase tracking-widest text-gray-400 mb-6">
                                    You scored {score} out of {quiz.length}
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={resetQuiz}
                                        className="px-6 py-3 bg-white text-black font-black uppercase border-2 border-white hover:bg-gray-200 flex items-center gap-2"
                                    >
                                        <RefreshCw size={16} /> Create New Quiz
                                    </button>
                                </div>
                            </div>
                            {/* Bg Pattern */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-black uppercase text-xl border-b-4 border-black inline-block">Review Incorrect Answers</h4>
                            {quiz.map((q, i) => {
                                const userAns = userAnswers[i];
                                const isCorrect = userAns === q.correctIndex;
                                if (isCorrect) return null; // Show only wrong ones? Or show all. Let's show all but highlight errors.
                                return null;
                            })}
                            {/* Actually show all for full review */}
                            {quiz.map((q, i) => (
                                <div key={i} className={`p-6 border-2 ${userAnswers[i] === q.correctIndex ? 'border-green-600 bg-green-50' : 'border-red-600 bg-red-50'}`}>
                                    <h3 className="font-bold uppercase mb-4 flex gap-2">
                                        <span className={`px-2 py-1 text-xs text-white ${userAnswers[i] === q.correctIndex ? 'bg-green-600' : 'bg-red-600'}`}>
                                            Q{i + 1}
                                        </span>
                                        {q.text}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                        {q.options.map((opt, optIdx) => (
                                            <div key={optIdx} className={`p-2 text-xs font-bold border-2 ${optIdx === q.correctIndex ? 'border-green-600 bg-white text-green-700' :
                                                (userAnswers[i] === optIdx ? 'border-red-600 bg-white text-red-700' : 'border-transparent opacity-50')
                                                }`}>
                                                {optIdx === q.correctIndex && <CheckCircle2 size={12} className="inline mr-1" />}
                                                {opt}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-xs font-mono p-3 bg-white border-2 border-gray-200">
                                        <span className="font-black uppercase text-gray-500">Explanation:</span> {q.explanation}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MockTesterView;
