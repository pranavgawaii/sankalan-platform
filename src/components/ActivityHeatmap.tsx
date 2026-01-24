import React from 'react';

const ActivityHeatmap: React.FC<{ year?: number }> = ({ year = 2026 }) => {
    // Generate mock data: 52 weeks * 7 days
    const weeks = 52;
    const days = 7;

    // Specific Months for Labels (Approximation based on 52 weeks starting Jan)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    // Helper to get random intensity (0-4) based on year + index for consistency
    const getIntensity = (week: number, day: number) => {
        // Simple deterministic PRNG
        const seed = year * 10000 + (week * 7) + day;
        const x = Math.sin(seed) * 10000;
        const r = x - Math.floor(x);

        if (r > 0.92) return 4;
        if (r > 0.8) return 3;
        if (r > 0.6) return 2;
        if (r > 0.3) return 1;
        return 0;
    };

    // Modern Green Palette (LeetCode-ish / Fresh SaaS)
    const getColor = (intensity: number) => {
        switch (intensity) {
            case 0: return 'bg-gray-200'; // Light Gray for Empty (Visible on white)
            case 1: return 'bg-[#9be9a8]'; // Lightest Green
            case 2: return 'bg-[#40c463]'; // Medium Green
            case 3: return 'bg-[#30a14e]'; // Darker Green
            case 4: return 'bg-[#216e39]'; // Darkest Green
            default: return 'bg-gray-200';
        }
    };

    return (
        <div className="w-full overflow-x-auto pb-4 min-h-[140px] scrollbar-hide">
            {/* Month Labels Row */}
            <div className="flex text-xs text-gray-400 font-medium mb-2 pl-0 font-['Inter'] justify-between w-full min-w-[650px]">
                {months.map((m, i) => (
                    <div key={i} className="text-center">{m}</div>
                ))}
            </div>

            {/* The Heatmap Grid */}
            <div className="flex gap-[3px] min-w-max pb-2">
                {/* Day Labels Column (Optional, usually Mon/Wed/Fri displayed) */}
                {/* We keep it simple without labels for now or could add sleek ones? Reference had none on left for the specific clip I imagine, but standard has Mon/Wed/Fri. Let's keep it clean without left labels for the "Fab" look unless requested. */}

                {Array.from({ length: weeks }).map((_, wIndex) => (
                    <div key={wIndex} className="flex flex-col gap-[3px]">
                        {Array.from({ length: days }).map((_, dIndex) => {
                            const intensity = getIntensity(wIndex, dIndex);
                            return (
                                <div
                                    key={`${wIndex}-${dIndex}`}
                                    className={`w-3 h-3 rounded-full ${getColor(intensity)} hover:ring-2 hover:ring-gray-300 transition-all cursor-pointer`}
                                    title={`${intensity === 0 ? 'No' : intensity * 3} contributions on ${year}`}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-end items-center gap-2 mt-4 text-xs text-gray-400 font-['Inter'] font-medium">
                <span>Less</span>
                <div className="flex gap-[3px]">
                    <div className={`w-3 h-3 rounded-full ${getColor(0)}`} />
                    <div className={`w-3 h-3 rounded-full ${getColor(1)}`} />
                    <div className={`w-3 h-3 rounded-full ${getColor(2)}`} />
                    <div className={`w-3 h-3 rounded-full ${getColor(3)}`} />
                    <div className={`w-3 h-3 rounded-full ${getColor(4)}`} />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
