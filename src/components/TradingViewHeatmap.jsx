import React, { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const TradingViewHeatmap = ({ stocks }) => {
  // Transform data for Treemap
  const data = useMemo(() => {
    if (!stocks || stocks.length === 0) return [];

    // Group by sector
    const sectors = stocks.reduce((acc, stock) => {
      const sector = stock.sector || 'Others';
      if (!acc[sector]) acc[sector] = [];
      acc[sector].push(stock);
      return acc;
    }, {});

    // Format for Recharts Treemap: { name: 'Sector', children: [ { name: 'Stock', size: price, ... } ] }
    return Object.entries(sectors).map(([sectorName, items]) => ({
      name: sectorName,
      children: items.map(stock => ({
        name: stock.symbol,
        size: Math.abs(stock.price * (stock.volume || 1000)), // Use turnover or just price if volume missing. 
        // Note: For better visualization without volume, we can use a fixed size or just price. 
        // Let's use price * 1000 as a proxy for market cap if volume is missing, or just price.
        // Actually, let's just use price for now as a simple proxy for "importance" in this demo, 
        // or better, use equal size if we want a grid, but Treemap needs size.
        // Let's use Math.abs(price) to ensure positive.
        value: Math.abs(stock.price), 
        ...stock
      }))
    }));
  }, [stocks]);

  const getColor = (percent) => {
    if (percent >= 3) return '#059669'; // Emerald 600
    if (percent >= 1) return '#10b981'; // Emerald 500
    if (percent >= 0) return '#34d399'; // Emerald 400
    if (percent >= -1) return '#f87171'; // Red 400
    if (percent >= -3) return '#ef4444'; // Red 500
    return '#b91c1c'; // Red 700
  };

  const CustomizedContent = (props) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;

    const percent = payload?.percent || 0;

    // Stock Node (Depth 2)
    if (depth === 2) {
      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: getColor(percent),
              stroke: '#0f172a', // Dark border for separation
              strokeWidth: 1,
            }}
          />
          {/* Sector Label (Only on first item of the group to simulate header) */}
          {index === 0 && (
             <text
              x={x + 4}
              y={y + 14}
              textAnchor="start"
              fill="rgba(255,255,255,0.7)"
              fontSize={10}
              fontWeight="bold"
              style={{ textTransform: 'uppercase', pointerEvents: 'none' }}
            >
              {payload.sector}
            </text>
          )}
          {/* Symbol */}
          {width > 30 && height > 20 && (
             <text
              x={x + width / 2}
              y={y + height / 2 - 6}
              textAnchor="middle"
              fill="#fff"
              fontSize={Math.min(width / 4, 12)}
              fontWeight="bold"
              style={{ pointerEvents: 'none' }}
            >
              {name}
            </text>
          )}
          {/* Percent Change */}
          {width > 30 && height > 30 && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 8}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize={Math.min(width / 5, 10)}
              style={{ pointerEvents: 'none' }}
            >
              {percent > 0 ? '+' : ''}{percent.toFixed(2)}%
            </text>
          )}
        </g>
      );
    }

    return null;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
          padding: '10px', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '4px',
          color: 'white'
        }}>
          <p className="label" style={{ fontWeight: 'bold', margin: 0 }}>{data.name}</p>
          <p style={{ margin: 0 }}>Price: ₹{data.price?.toLocaleString('en-IN')}</p>
          <p style={{ margin: 0, color: getColor(data.percent) }}>
            Change: {data.percent?.toFixed(2)}%
          </p>
          <p style={{ margin: 0, fontSize: '0.8em', color: '#94a3b8' }}>{data.sector}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          width={400}
          height={200}
          data={data}
          dataKey="value"
          ratio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingViewHeatmap;
