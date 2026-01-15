import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    doc,
    updateDoc,
    increment,
    limit
} from 'firebase/firestore';
import { db } from './firebase';

export interface StudyFilter {
    type?: 'all' | 'pyq' | 'note' | 'video' | 'pdf' | 'pptx';
    subject?: string;
    semester?: string;
    year?: string;
    branch?: string;
    searchQuery?: string;
}

const RESOURCES_COLLECTION = 'resources';

/**
 * Fetches study materials based on filters.
 */
export const fetchStudyMaterials = async (filters: StudyFilter = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`🔥 [${timestamp}] fetchStudyMaterials called with filters:`, JSON.stringify(filters, null, 2));

    try {
        const resourcesRef = collection(db, RESOURCES_COLLECTION);
        const constraints = [];

        // 1. Branch Filter (Required/Primary)
        if (filters.branch && filters.branch !== 'ALL') {
            constraints.push(where('branch', '==', filters.branch));
        }

        // 2. Year Filter (Number)
        if (filters.year && filters.year !== 'ALL') {
            const yearNum = Number(filters.year);
            console.log(`🔢 [${timestamp}] Filtering by year:`, yearNum, typeof yearNum);
            if (!isNaN(yearNum)) {
                constraints.push(where('year', '==', yearNum));
            } else {
                console.warn(`⚠️ [${timestamp}] Invalid year filter:`, filters.year);
            }
        }

        // 3. Subject Filter (subjectCode or subjectName)
        if (filters.subject && filters.subject !== 'ALL') {
            console.log(`📘 [${timestamp}] Filtering by subject code:`, filters.subject);
            constraints.push(where('subjectCode', '==', filters.subject));
        }

        console.log(`🛒 [${timestamp}] Query constraints count:`, constraints.length);

        const q = query(resourcesRef, ...constraints);
        const querySnapshot = await getDocs(q);

        console.log(`📦 [${timestamp}] Documents found:`, querySnapshot.size);
        if (querySnapshot.empty) {
            console.log(`⚠️ [${timestamp}] No documents found for constraints. Check if 'type' or other fields match.`);
        }

        const materials = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Client-side search filtering (Firestore doesn't support full-text search natively)
        if (filters.searchQuery) {
            const lowerQuery = filters.searchQuery.toLowerCase();
            return materials.filter((m: any) =>
                (m.title && m.title.toLowerCase().includes(lowerQuery)) ||
                (m.subject && m.subject.toLowerCase().includes(lowerQuery))
            );
        }

        return materials;
    } catch (error) {
        console.error("Error fetching study materials:", error);
        return [];
    }
};

/**
 * Fetches only PYQs for a given semester/subject.
 */
export const fetchPYQs = async (semester?: string, subject?: string) => {
    return fetchStudyMaterials({ type: 'pyq', semester, subject });
};

/**
 * Fetches only Notes for a given semester/subject.
 */
export const fetchNotes = async (semester?: string, subject?: string) => {
    return fetchStudyMaterials({ type: 'note', semester, subject });
};

/**
 * Increments the download count for a material.
 */
export const trackDownload = async (materialId: string) => {
    if (!materialId) return;
    try {
        const docRef = doc(db, RESOURCES_COLLECTION, materialId);
        await updateDoc(docRef, {
            downloads: increment(1)
        });
        console.log(`Download tracked for ${materialId}`);
    } catch (error) {
        console.error("Error tracking download:", error);
    }
};

/**
 * Increments the view count for a material.
 */
export const trackView = async (materialId: string) => {
    if (!materialId) return;
    try {
        const docRef = doc(db, RESOURCES_COLLECTION, materialId);
        await updateDoc(docRef, {
            views: increment(1)
        });
        console.log(`View tracked for ${materialId}`);
    } catch (error) {
        console.error("Error tracking view:", error);
    }
};
