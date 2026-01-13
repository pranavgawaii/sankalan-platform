import React, { useState, useEffect } from 'react';
import { Key, Save, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface GeminiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
}

const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('GEMINI_API_KEY');
        if (storedKey) {
            setApiKey(storedKey);
            setIsSaved(true);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!apiKey.trim().startsWith('AIza')) {
            setError('INVALID KEY FORMAT (Should start with AIza...)');
            return;
        }
        localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
        setIsSaved(true);
        setError('');
        onSave(apiKey.trim());
    };

    const handleClear = () => {
        localStorage.removeItem('GEMINI_API_KEY');
        setApiKey('');
        setIsSaved(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-black w-full max-w-md shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2">
                        <Key size={20} /> Configure AI Access
                    </h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-yellow-50 border-2 border-black p-4 text-xs font-bold uppercase leading-relaxed">
                        <div className="flex items-center gap-2 mb-2 text-yellow-700">
                            <AlertTriangle size={16} />
                            <span>Privacy Notice</span>
                        </div>
                        We do not store your API key on any server. It is saved locally in your browser to make requests to Google directly.
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase mb-2 block">Gemini API Key</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => { setApiKey(e.target.value); setIsSaved(false); }}
                                placeholder="AIzaSy..."
                                className="w-full border-2 border-black p-3 pr-10 font-mono text-sm focus:outline-none focus:bg-gray-50 uppercase"
                            />
                            {isSaved && (
                                <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600" />
                            )}
                        </div>
                        {error && <p className="text-red-600 text-[10px] font-black uppercase mt-1">{error}</p>}
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold uppercase text-blue-600 hover:underline mt-2 inline-block"
                        >
                            Get a free key from Google AI Studio →
                        </a>
                    </div>

                    <div className="flex gap-4">
                        {isSaved ? (
                            <button
                                onClick={handleClear}
                                className="flex-1 py-3 border-2 border-red-600 text-red-600 font-black uppercase hover:bg-red-50 transition-colors text-sm"
                            >
                                Clear Key
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 border-2 border-black font-black uppercase hover:bg-gray-100 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        )}

                        <button
                            onClick={handleSave}
                            className="flex-1 py-3 bg-black text-white border-2 border-black font-black uppercase hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> Save & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeminiKeyModal;
