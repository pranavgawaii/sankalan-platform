import { useState, useEffect } from 'react';
import { fetchStudyMaterials, StudyFilter } from '../lib/firestoreService';

export interface StudyMaterial {
    id: string;
    title: string;
    type: 'pdf' | 'pptx' | 'video' | 'doc' | 'pyq' | 'note';
    size: string;
    views: number;
    url: string;
    fileUrl?: string; // Raw Firestore field
    unit?: number;
    author?: string;
    subject: string;
    year?: string;
    semester?: string;
    createdAt?: any;
    downloads?: number;
}

export const useStudyMaterials = (subject?: string, filters?: Omit<StudyFilter, 'subject'>) => {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMaterials = async () => {
            setLoading(true);
            try {
                // Combine subject with other filters
                const queryFilters: StudyFilter = {
                    subject,
                    ...filters
                };

                const data = await fetchStudyMaterials(queryFilters);

                // Map to strict StudyMaterial interface if needed, 
                // though fetchStudyMaterials returns "any[]" effectively.
                // We trust the data shape or would add validation here.
                const typedMaterials: StudyMaterial[] = data.map((d: any) => ({
                    id: d.id,
                    title: d.title || d.fileName || 'Untitled',
                    type: d.examtype === 'MSE' ? 'TA1' : (d.examtype === 'ESE' ? 'EndSem' : (d.type || 'pdf')),
                    size: d.size || '300 KB',
                    views: d.views || 0,
                    downloads: d.downloads || 0,
                    url: d.fileUrl || '#',
                    fileUrl: d.fileUrl,
                    unit: d.unit ? Number(d.unit) : 1,
                    author: d.author || 'Admin',
                    subject: d.subject || d.subjectName || 'Unknown', // Fallback to subjectName if subject is missing
                    year: d.year, // Academic Year (1, 2, 3, 4)
                    examYear: d.examYear, // Calendar Year (e.g. 2023)
                    semester: d.semester || 'S5'
                }));

                setMaterials(typedMaterials);
            } catch (err: any) {
                console.error("Error in useStudyMaterials:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadMaterials();
    }, [subject, JSON.stringify(filters)]); // JSON.stringify to avoid infinite loop on object dependency

    return { materials, loading, error };
};
