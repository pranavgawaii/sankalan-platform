import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, ExternalLink, Database, FileText } from 'lucide-react';
import { fetchStudyMaterials } from '../lib/firestoreService';
import { db } from '../../firebaseConfig';

interface Material {
    id: string;
    [key: string]: any;
}

const TestFirebase: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState({
        firebaseInit: false,
        firestoreAccessible: false,
        documentsFound: 0,
    });

    useEffect(() => {
        testFirebaseConnection();
    }, []);

    const testFirebaseConnection = async () => {
        console.log('🔥 [TEST] Starting Firebase connection test at:', new Date().toISOString());
        setLoading(true);
        setError(null);

        try {
            // Test 1: Firebase Initialization
            console.log('✅ [TEST] Firebase DB initialized:', !!db);
            setConnectionStatus(prev => ({ ...prev, firebaseInit: !!db }));

            // Test 2: Firestore Access
            console.log('✅ [TEST] Firestore instance available:', !!db);
            setConnectionStatus(prev => ({ ...prev, firestoreAccessible: !!db }));

            // Test 3: Fetch Materials
            console.log('📡 [TEST] Fetching materials from Firestore...');
            const fetchedMaterials = await fetchStudyMaterials({});

            console.log('📊 [TEST] Materials fetched:', fetchedMaterials.length);
            console.log('📋 [TEST] Raw materials data:', JSON.stringify(fetchedMaterials, null, 2));

            setMaterials(fetchedMaterials);
            setConnectionStatus(prev => ({ ...prev, documentsFound: fetchedMaterials.length }));

            if (fetchedMaterials.length === 0) {
                console.warn('⚠️ [TEST] No materials found in Firestore!');
                setError('No materials found in Firestore. Your collection might be empty.');
            } else {
                console.log('✅ [TEST] Successfully fetched materials!');
            }

        } catch (err: any) {
            console.error('❌ [TEST] Firebase connection error:', err);
            console.error('❌ [TEST] Error details:', {
                message: err.message,
                code: err.code,
                stack: err.stack
            });
            setError(`Firebase Error: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-black text-white p-6 mb-6 border-4 border-black">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                        🔥 Firebase Connection Test
                    </h1>
                    <p className="text-sm font-bold uppercase opacity-70">
                        Testing Firestore connection and data retrieval
                    </p>
                </div>

                {/* Connection Status */}
                <div className="bg-white border-4 border-black p-6 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                        <Database size={24} /> Connection Status
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            {connectionStatus.firebaseInit ? (
                                <CheckCircle2 className="text-green-600" size={20} />
                            ) : (
                                <XCircle className="text-red-600" size={20} />
                            )}
                            <span className="font-bold">Firebase Initialized</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {connectionStatus.firestoreAccessible ? (
                                <CheckCircle2 className="text-green-600" size={20} />
                            ) : (
                                <XCircle className="text-red-600" size={20} />
                            )}
                            <span className="font-bold">Firestore Accessible</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {connectionStatus.documentsFound > 0 ? (
                                <CheckCircle2 className="text-green-600" size={20} />
                            ) : (
                                <XCircle className="text-red-600" size={20} />
                            )}
                            <span className="font-bold">
                                Documents Found: <span className="text-purple-600">{connectionStatus.documentsFound}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-blue-50 border-4 border-black p-8 text-center">
                        <Loader2 className="animate-spin mx-auto mb-4" size={48} />
                        <p className="font-black uppercase">Testing Firebase Connection...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border-4 border-red-600 p-6 mb-6">
                        <h3 className="text-xl font-black uppercase text-red-600 mb-2 flex items-center gap-2">
                            <XCircle size={24} /> Error Detected
                        </h3>
                        <p className="font-bold text-red-800 mb-4">{error}</p>
                        <div className="bg-white border-2 border-red-600 p-4 rounded">
                            <p className="font-bold text-sm mb-2">Common Fixes:</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Check if .env.local has correct Firebase credentials</li>
                                <li>Verify firebaseConfig.js is using VITE_ prefixed variables</li>
                                <li>Ensure Firestore collection 'resources' exists</li>
                                <li>Check browser console for detailed error logs</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Materials Display */}
                {!loading && !error && materials.length > 0 && (
                    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
                            <FileText size={24} /> Materials Found ({materials.length})
                        </h2>
                        <div className="space-y-6">
                            {materials.map((material, index) => (
                                <div key={material.id} className="border-4 border-black p-4 bg-gray-50">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-black uppercase">
                                            #{index + 1}: {material.title || 'Untitled'}
                                        </h3>
                                        <span className={`px-3 py-1 font-black uppercase text-xs ${material.type === 'pyq' ? 'bg-yellow-400' : 'bg-blue-400'
                                            } border-2 border-black`}>
                                            {material.type || 'unknown'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <span className="text-xs font-black uppercase text-gray-500">Document ID:</span>
                                            <p className="font-mono text-sm">{material.id}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-black uppercase text-gray-500">Subject:</span>
                                            <p className="font-bold">{material.subject || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-black uppercase text-gray-500">Semester:</span>
                                            <p className="font-bold">{material.semester || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-black uppercase text-gray-500">Branch:</span>
                                            <p className="font-bold">{material.branch || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {material.fileUrl && (
                                        <a
                                            href={material.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 font-black uppercase text-xs hover:bg-gray-800 mb-3"
                                        >
                                            <ExternalLink size={14} /> Open File
                                        </a>
                                    )}

                                    <details className="mt-3">
                                        <summary className="cursor-pointer font-black uppercase text-xs text-gray-600 hover:text-black">
                                            Show Raw JSON Data
                                        </summary>
                                        <pre className="mt-2 bg-black text-green-400 p-4 rounded text-xs overflow-x-auto font-mono">
                                            {JSON.stringify(material, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Materials Found */}
                {!loading && !error && materials.length === 0 && (
                    <div className="bg-yellow-50 border-4 border-yellow-600 p-6">
                        <h3 className="text-xl font-black uppercase text-yellow-800 mb-2">
                            No Materials Found
                        </h3>
                        <p className="font-bold mb-4">
                            Firebase connection is working, but no documents were found in the 'resources' collection.
                        </p>
                        <div className="bg-white border-2 border-yellow-600 p-4 rounded">
                            <p className="font-bold text-sm mb-2">Next Steps:</p>
                            <ol className="list-decimal list-inside text-sm space-y-1">
                                <li>Open Firebase Console</li>
                                <li>Go to Firestore Database</li>
                                <li>Check if 'resources' collection exists</li>
                                <li>Verify you have documents in the collection</li>
                                <li>Check if documents have the expected fields (title, type, subject, etc.)</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-purple-50 border-4 border-purple-600 p-6 mt-6">
                    <h3 className="text-xl font-black uppercase mb-3">📋 Testing Instructions</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="font-black uppercase text-purple-800">Step 1: Check Browser Console</p>
                            <p className="font-bold">Open DevTools (F12) → Console tab to see detailed Firebase logs</p>
                        </div>
                        <div>
                            <p className="font-black uppercase text-purple-800">Step 2: Verify Connection Status</p>
                            <p className="font-bold">All three status items above should show green checkmarks</p>
                        </div>
                        <div>
                            <p className="font-black uppercase text-purple-800">Step 3: Check Materials</p>
                            <p className="font-bold">You should see your 2 materials (1 PYQ + 1 Notes) displayed below</p>
                        </div>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={testFirebaseConnection}
                        disabled={loading}
                        className="bg-black text-white px-8 py-3 font-black uppercase border-4 border-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Testing...' : '🔄 Retest Connection'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestFirebase;
