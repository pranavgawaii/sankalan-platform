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
import { db } from '../../firebaseConfig';

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
    console.log(`🔥 [${timestamp}] fetchStudyMaterials called with filters:`, filters);

    try {
        const resourcesRef = collection(db, RESOURCES_COLLECTION);
        console.log(`📚 [${timestamp}] Accessing collection: ${RESOURCES_COLLECTION}`);
        const constraints = [];

        // Apply filters
        if (filters.subject && filters.subject !== 'ALL') {
            constraints.push(where('subject', '==', filters.subject));
        }

        if (filters.type && filters.type !== 'all' && filters.type !== 'ALL') {
            // If type is specifically 'pyq' or 'note', filter by it.
            // Note: The UI might use 'pdf'/'pptx' as types too, so we need to be careful.
            // Only filter if it maps to a valid DB type field or if we trust the input.
            constraints.push(where('type', '==', filters.type));
        }

        if (filters.semester && filters.semester !== 'ALL') {
            constraints.push(where('semester', '==', filters.semester));
        }

        if (filters.year && filters.year !== 'ALL') {
            constraints.push(where('year', '==', filters.year));
        }

        // Add sorting
        // Note: Firestore requires an index for compound queries with orderBy.
        // We will try to order by createdAt if possible, but might fail without index.
        // For now, let's just fetch and sort client-side if needed to avoid index errors during dev.
        // constraints.push(orderBy('createdAt', 'desc'));

        const q = query(resourcesRef, ...constraints);
        const querySnapshot = await getDocs(q);

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
