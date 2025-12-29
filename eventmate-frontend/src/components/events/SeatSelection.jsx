import React, { useMemo } from 'react';

const SeatSelection = ({ rows, cols, occupiedSeats, selectedSeats, onSeatClick, seatConfig }) => {
    
    // 1. Helper: Convert number to Letter (1=A, 2=B) - RESTORED from Old Code
    const getRowLabel = (num) => String.fromCharCode(64 + num);

    // 2. Parse Config to create a map of Row -> {Price, Label} - NEW Logic
    const rowPricing = useMemo(() => {
        const map = {};
        if (!seatConfig) return map;

        // Example Config: "1-2:500:VIP, 3-10:200:Eco"
        const rules = seatConfig.split(/[,\n]/); // Split by comma or newline
        rules.forEach(rule => {
            const parts = rule.split(':');
            if (parts.length >= 2) {
                const range = parts[0].split('-');
                const start = parseInt(range[0]);
                const end = parseInt(range[1] || range[0]); 
                const price = parseFloat(parts[1]);
                const label = parts[2] || '';

                for (let r = start; r <= end; r++) {
                    map[r] = { price, label };
                }
            }
        });
        return map;
    }, [seatConfig]);

    // Helper to get seat status
    const getSeatStatus = (r, c) => {
        // Seat ID format: "1-1" (Row-Col index) for logic, but UI shows A1
        // We use numerical IDs for backend consistency: "RowIndex-ColIndex"
        const seatId = `${r}-${c}`;
        if (occupiedSeats.includes(seatId)) return 'occupied';
        if (selectedSeats.includes(seatId)) return 'selected';
        return 'available';
    };

    return (
        <div className="w-full overflow-x-auto pb-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-inner">
            {/* Screen Visual */}
            <div className="w-full max-w-lg mx-auto mb-10 text-center">
                <div className="h-2 w-full bg-blue-300 dark:bg-blue-600 rounded-t-full mb-2 shadow-[0_5px_15px_rgba(59,130,246,0.4)]"></div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Screen</p>
            </div>

            <div className="flex flex-col gap-3 min-w-max mx-auto items-center">
                {Array.from({ length: rows }).map((_, rIndex) => {
                    const rowNum = rIndex + 1;
                    const rowLabel = getRowLabel(rowNum); // A, B, C...
                    const tier = rowPricing[rowNum]; // Get tier info for this row
                    
                    return (
                        <div key={rowNum} className="flex items-center gap-4">
                            
                            {/* Row Label (Left) */}
                            <div className="w-24 text-right flex flex-col justify-center items-end">
                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 w-6 text-center">
                                    {rowLabel}
                                </span>
                                {/* Tier Price Hint */}
                                {tier && (
                                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-gray-700 px-1 rounded">
                                        {tier.label} ₹{tier.price}
                                    </span>
                                )}
                            </div>

                            {/* Seats Grid */}
                            <div className="flex gap-2">
                                {Array.from({ length: cols }).map((_, cIndex) => {
                                    const colNum = cIndex + 1;
                                    const seatId = `${rowNum}-${colNum}`;
                                    const status = getSeatStatus(rowNum, colNum);

                                    let bgClass = "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500";
                                    
                                    if (status === 'occupied') {
                                        bgClass = "bg-gray-300 dark:bg-gray-600 border-transparent text-gray-400 cursor-not-allowed";
                                    } else if (status === 'selected') {
                                        bgClass = "bg-green-500 border-green-600 text-white shadow-md scale-110";
                                    } else if (tier?.label?.toLowerCase().includes('vip')) {
                                        // Special styling for VIP rows (Gold/Yellow tint)
                                        bgClass += " border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"; 
                                    }

                                    return (
                                        <button
                                            key={seatId}
                                            onClick={() => status !== 'occupied' && onSeatClick(seatId)}
                                            disabled={status === 'occupied'}
                                            className={`
                                                w-8 h-8 rounded-t-lg border-b-4 border-l border-r border-t text-[10px] font-bold 
                                                flex items-center justify-center transition-all duration-200 
                                                ${bgClass}
                                            `}
                                            title={tier ? `${rowLabel}${colNum} (${tier.label}) - ₹${tier.price}` : `${rowLabel}${colNum}`}
                                        >
                                            {/* Hide number if occupied for cleaner look */}
                                            {status === 'occupied' ? '' : colNum}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Row Label (Right) - For symmetry */}
                            <div className="w-6 text-left">
                                <span className="text-xs font-bold text-gray-400">{rowLabel}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-t-lg bg-white"></div> 
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 border-b-4 border-green-600 rounded-t-lg"></div> 
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-300 rounded-t-lg"></div> 
                    <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-yellow-50 border-2 border-yellow-400 rounded-t-lg"></div> 
                    <span>VIP/Premium</span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;