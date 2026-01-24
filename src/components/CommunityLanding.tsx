import React from 'react';
import SectionHub, { SectionCardData } from './SectionHub';

interface CommunityLandingProps {
    onNavigate: (view: string) => void;
}

const CommunityLanding: React.FC<CommunityLandingProps> = ({ onNavigate }) => {
    const cards: SectionCardData[] = [
        {
            id: 'study-rooms',
            icon: '👥',
            title: 'Study Rooms',
            description: 'Join virtual study rooms with focus timers, lo-fi music, and peer accountability.',
            meta: '12 Active Rooms',
            buttonText: 'Join Room',
            route: 'study-rooms'
        },
        {
            id: 'projects',
            icon: '🚀',
            title: 'Project Showcase',
            description: 'Showcase your academic and personal projects to the entire campus network.',
            meta: 'Coming Soon',
            buttonText: 'Browse Projects',
            isComingSoon: true
        },
        {
            id: 'events',
            icon: '📅',
            title: 'Campus Events',
            description: 'Stay updated with upcoming hackathons, workshops, and cultural fests.',
            meta: '3 Recent Events',
            buttonText: 'View Events',
            route: 'campus-events'
        }
    ];

    return (
        <SectionHub
            sectionIcon="🌍"
            sectionTitle="COMMUNITY"
            sectionSubtitle="Connect, collaborate, and grow. Calculate together, build together, succeed together."
            stats={[
                { value: '5k+', label: 'Students' },
                { value: '12', label: 'Live Rooms' },
                { value: '24/7', label: 'Active' }
            ]}
            cards={cards}
            onNavigate={onNavigate}
        />
    );
};

export default CommunityLanding;
