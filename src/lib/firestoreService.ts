import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    doc,
    updateDoc,
    increment,
    limit,
    addDoc,
    deleteDoc
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
const EVENTS_COLLECTION = 'events';
const CLUBS_COLLECTION = 'clubs';
const REGISTRATIONS_COLLECTION = 'registrations';

export interface CalendarEvent {
    id?: string;
    title: string;
    date: string;
    type: 'exam' | 'contest' | 'career' | 'other' | 'club_event';
    description?: string;
    clubId?: string;       // ID of the club hosting the event
    image?: string;        // Poster URL
    whatsappLink?: string; // WhatsApp Group Link
    capacity?: number;     // Max seats
    registeredCount?: number; // Current registrations
}

export interface Club {
    id?: string;
    name: string;
    username: string; // Login ID
    password?: string; // Stored securely (mock for now or simple ref)
    logo?: string;
    coordinatorName?: string;
}

export interface Registration {
    id?: string;
    eventId: string;
    studentName: string;
    prn: string;
    email: string;
    branch: string;
    year: string;
    phone: string;
    timestamp: string;
}

/**
 * Fetches all events ordered by date.
 */
export const fetchEvents = async () => {
    try {
        const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'asc'));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as CalendarEvent));
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

/**
 * Adds a new event.
 */
export const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
        await addDoc(collection(db, EVENTS_COLLECTION), {
            ...event,
            registeredCount: 0 // Init count
        });
    } catch (error) {
        console.error("Error adding event:", error);
    }
};

/**
 * Deletes an event.
 */
export const deleteEvent = async (id: string) => {
    try {
        await deleteDoc(doc(db, EVENTS_COLLECTION, id));
    } catch (error) {
        console.error("Error deleting event:", error);
    }
};

// --- CLUB FUNCTIONS ---

export const fetchClubs = async () => {
    try {
        const snap = await getDocs(collection(db, CLUBS_COLLECTION));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Club));
    } catch (error) {
        console.error("Error fetching clubs:", error);
        return [];
    }
};

export const addClub = async (club: Club) => {
    try {
        await addDoc(collection(db, CLUBS_COLLECTION), club);
    } catch (error) {
        console.error("Error adding club:", error);
    }
};

export const deleteClub = async (id: string) => {
    try {
        await deleteDoc(doc(db, CLUBS_COLLECTION, id));
    } catch (error) {
        console.error("Error deleting club:", error);
    }
};

// --- REGISTRATION FUNCTIONS ---

export const registerForEvent = async (registration: Omit<Registration, 'id' | 'timestamp'>) => {
    try {
        // 1. Add Registration
        await addDoc(collection(db, REGISTRATIONS_COLLECTION), {
            ...registration,
            timestamp: new Date().toISOString()
        });

        // 2. Increment Event Count
        const eventRef = doc(db, EVENTS_COLLECTION, registration.eventId);
        await updateDoc(eventRef, {
            registeredCount: increment(1)
        });

    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};

export const fetchRegistrations = async (eventId: string) => {
    try {
        const q = query(
            collection(db, REGISTRATIONS_COLLECTION),
            where('eventId', '==', eventId)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Registration));
    } catch (error) {
        console.error("Error fetching registrations:", error);
        return [];
    }
};

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
