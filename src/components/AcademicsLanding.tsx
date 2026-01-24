import React from 'react';
import SectionHub, { SectionCardData } from './SectionHub';

interface AcademicsLandingProps {
    onNavigate: (view: string) => void;
}

const AcademicsLanding: React.FC<AcademicsLandingProps> = ({ onNavigate }) => {
    const cards: SectionCardData[] = [
        {
            id: 'pyqs',
            icon: '📚',
            title: 'PYQs Archive',
            description: 'Access a comprehensive database of Previous Year Questions arranged by year and subject.',
            meta: '500+ Papers',
            buttonText: 'Browse Papers',
            route: 'pyqs'
        },
        {
            id: 'materials',
            icon: '📖',
            title: 'Study Materials',
            description: 'Reference books, faculty notes, and curated external resources for your syllabus.',
            meta: '200+ Resources',
            buttonText: 'View Resources',
            route: 'materials'
        },
        {
            id: 'notes',
            icon: '✍️',
            title: 'Lecture Notes',
            description: 'Community-sourced lecture notes and handwritten summaries from top students.',
            meta: 'Coming Soon',
            buttonText: 'Access Notes',
            isComingSoon: true
        }
    ];

    return (
        <SectionHub
            sectionIcon="🎓"
            sectionTitle="ACADEMICS"
            sectionSubtitle="Your central command for coursework. Access past papers, reference materials, and high-quality notes."
            stats={[
                { value: '12', label: 'Subjects' },
                { value: '500+', label: 'Papers' },
                { value: '1.2k', label: 'Downloads' }
            ]}
            cards={cards}
            onNavigate={onNavigate}
        />
    );
};

export default AcademicsLanding;
