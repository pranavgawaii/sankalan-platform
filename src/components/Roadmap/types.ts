export interface Resource {
    type: 'video' | 'article' | 'docs' | 'course';
    title: string;
    duration?: string;
    url?: string;
}

export interface Topic {
    topicId: string;
    name: string; // Short name for the node
    title: string; // Full title for details
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    estimatedHours: number;
    keyPoints: string[];
    relatedNotes?: string[];
    relatedPYQs?: string[];
    resources: Resource[];
    color?: string; // Hex code for node border/bg
    prerequisites?: string[]; // topicIds
}

export interface Phase {
    phaseId: number;
    phaseName: string;
    topics: Topic[];
}

export interface Roadmap {
    id: string;
    title: string;
    icon: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    topicCount?: number;
    phases: Phase[];
}

export interface FeaturedSheet {
    id: string;
    title: string;
    subtitle: string;
    creator: string;
    icon: string;
    badge: string;
    tags: string[];
    description: string;
    features: string[];
    stats: {
        problemCount: string;
        videoCount: string;
        studentsPlaced?: string;
        placementRate?: string;
        companies?: string[] | string;
        avgRating?: number;
    };
    externalLink: string;
    introVideoLink: string;
    highlightColor: string;
    companies: string[];
}

export interface Category {
    id: string;
    title: string;
    description: string;
    icon: string; // Emoji or Lucide icon name
    colorFrom: string; // Gradient start
    colorTo: string; // Gradient end
    roadmaps: Roadmap[];
    featuredSheets?: FeaturedSheet[];
}

export interface RoadmapData {
    categories: Category[];
}
