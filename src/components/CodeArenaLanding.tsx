import React from 'react';
import SectionHub, { SectionCardData } from './SectionHub';

interface CodeArenaLandingProps {
    onNavigate: (view: string) => void;
}

const CodeArenaLanding: React.FC<CodeArenaLandingProps> = ({ onNavigate }) => {
    const cards: SectionCardData[] = [
        {
            id: 'practice',
            icon: '💻',
            title: 'Practice Problems',
            description: 'A collection of problems categorized by topic and difficulty level. Perfect for daily practice.',
            meta: '150+ Problems',
            buttonText: 'Start Coding',
            route: 'practice',
            isComingSoon: true // Placeholder until Practice view is ready
        },
        {
            id: 'sheets',
            icon: '📝',
            title: 'DSA Sheets',
            description: 'Structured preparation with Striver\'s SDE and A-Z DSA sheets. Track your progress systematically.',
            meta: '450 Questions',
            buttonText: 'View Sheets',
            route: 'pathways' // Mapping to Roadmap/DSA view
        },
        {
            id: 'leaderboard',
            icon: '🏆',
            title: 'Leaderboard',
            description: 'Compete with your batchmates and see where you stand in the college-wide rankings.',
            meta: 'Coming Soon',
            buttonText: 'View Rankings',
            isComingSoon: true
        }
    ];

    return (
        <SectionHub
            sectionIcon="⚔️"
            sectionTitle="CODE ARENA"
            sectionSubtitle="Sharpen your algorithmic skills. Solve problems, track your progress, and compete with peers."
            stats={[
                { value: '0', label: 'Solved' },
                { value: '150+', label: 'Problems' },
                { value: '#--', label: 'Rank' }
            ]}
            cards={cards}
            onNavigate={onNavigate}
        />
    );
};

export default CodeArenaLanding;
