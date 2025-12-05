import React, { useMemo } from 'react';

const PolarHeatmap = ({ stocks }) => {
  // Group stocks by sector
  const sectors = useMemo(() => {
    if (!stocks) return [];
    
    const grouped = stocks.reduce((acc, stock) => {
      const sector = stock.sector || 'Others';
      if (!acc[sector]) acc[sector] = [];
      acc[sector].push(stock);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => Math.abs(b.percent) - Math.abs(a.percent)) // Sort by magnitude
    }));
  }, [stocks]);

  if (!stocks || stocks.length === 0) return null;

  // Chart configuration
  const size = 600;
  const center = size / 2;
  const radius = size / 2 - 40; // Leave room for labels
  const innerRadius = 40; // Don't start from absolute center
  
  // Calculate total items to determine angle per item
  const totalItems = sectors.reduce((sum, s) => sum + s.items.length, 0);
  const anglePerItem = (2 * Math.PI) / totalItems;

  let currentAngle = -Math.PI / 2; // Start at top

  // Helper to get coordinates
  const getCoordinates = (angle, r) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle)
  });

  // Helper for color
  const getColor = (percent) => {
    if (percent >= 3) return '#059669'; // Emerald 600
    if (percent >= 1) return '#10b981'; // Emerald 500
    if (percent >= 0) return '#34d399'; // Emerald 400
    if (percent >= -1) return '#f87171'; // Red 400
    if (percent >= -3) return '#ef4444'; // Red 500
    return '#b91c1c'; // Red 700
  };

  return (
    <div className="polar-heatmap-container">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="polar-chart">
        {/* Background circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={innerRadius + (radius - innerRadius) * scale}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4 4"
          />
        ))}

        {sectors.map((sector) => {
          return sector.items.map((stock, i) => {
            const startAngle = currentAngle;
            const endAngle = currentAngle + anglePerItem;
            currentAngle += anglePerItem;

            // Radius depends on absolute percent change
            // Normalize: 0% -> innerRadius, 5% -> radius
            const maxPercent = 5;
            const magnitude = Math.min(Math.abs(stock.percent), maxPercent);
            const normalizedMagnitude = magnitude / maxPercent;
            const itemRadius = innerRadius + (radius - innerRadius) * (0.2 + 0.8 * normalizedMagnitude);

            // Create path for the wedge
            const start = getCoordinates(startAngle, itemRadius);
            const end = getCoordinates(endAngle, itemRadius);
            const innerStart = getCoordinates(startAngle, innerRadius);
            const innerEnd = getCoordinates(endAngle, innerRadius);

            const path = [
              `M ${innerStart.x} ${innerStart.y}`,
              `L ${start.x} ${start.y}`,
              `A ${itemRadius} ${itemRadius} 0 0 1 ${end.x} ${end.y}`,
              `L ${innerEnd.x} ${innerEnd.y}`,
              `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
              'Z'
            ].join(' ');

            // Calculate label position (midpoint of outer arc)
            const midAngle = (startAngle + endAngle) / 2;
            const labelRadius = itemRadius + 15;
            const labelPos = getCoordinates(midAngle, labelRadius);
            
            // Adjust label alignment based on side
            const isRight = Math.cos(midAngle) > 0;
            const isTop = Math.sin(midAngle) < 0;

            return (
              <g key={stock.symbol} className="stock-wedge-group">
                <path
                  d={path}
                  fill={getColor(stock.percent)}
                  stroke="rgba(30, 41, 59, 0.8)"
                  strokeWidth="1"
                  className="stock-wedge"
                >
                  <title>{`${stock.symbol}: ${stock.percent.toFixed(2)}% (${stock.name})`}</title>
                </path>
                
                {/* Only show label if slice is large enough or on hover */}
                {magnitude > 0.5 && (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="10"
                    transform={`rotate(${(midAngle * 180) / Math.PI + 90}, ${labelPos.x}, ${labelPos.y})`}
                  >
                    {stock.symbol}
                  </text>
                )}
              </g>
            );
          });
        })}
        
        {/* Center Label */}
        <circle cx={center} cy={center} r={innerRadius - 5} fill="rgba(30, 41, 59, 1)" />
        <text
          x={center}
          y={center}
          textAnchor="middle"
          alignmentBaseline="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
        >
          NIFTY
        </text>
      </svg>
    </div>
  );
};

export default PolarHeatmap;
