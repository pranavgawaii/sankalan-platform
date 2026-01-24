import React from 'react';
import SectionHub, { SectionCardData } from './SectionHub';

interface CareerLandingProps {
    onNavigate: (view: string) => void;
}

const CareerLanding: React.FC<CareerLandingProps> = ({ onNavigate }) => {
    const cards: SectionCardData[] = [
        {
            id: 'roadmaps',
            icon: '🗺️',
            title: 'Learning Roadmaps',
            description: 'Step-by-step interactive guides for various career paths including DSA, Web Dev, and AI.',
            meta: '14+ Paths',
            buttonText: 'Explore Paths',
            route: 'pathways'
        },
        {
            id: 'tools',
            icon: '🤖',
            title: 'AI Career Tools',
            description: 'Mock interviews, resume builder, and Note summarizer powered by Gemini AI.',
            meta: '3 Powerful Tools',
            buttonText: 'Launch Tools',
            route: 'tools'
        },
        {
            id: 'placement',
            icon: '💼',
            title: 'Placement Prep',
            description: 'Company-specific questions, aptitude tests, and HR interview guides.',
            meta: 'Coming Soon',
            buttonText: 'Start Prep',
            isComingSoon: true
        }
    ];

    return (
        <SectionHub
            sectionIcon="🚀"
            sectionTitle="CAREER & GROWTH"
            sectionSubtitle="Plan your future with intention. Structured roadmaps and AI-powered tools to accelerate your journey."
            stats={[
                { value: '14', label: 'Roadmaps' },
                { value: '3', label: 'AI Tools' },
                { value: '100%', label: 'Free' }
            ]}
            cards={cards}
            onNavigate={onNavigate}
        />
    );
};

export default CareerLanding;
