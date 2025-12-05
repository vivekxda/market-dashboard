import React, { useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const TradingViewHeatmap = ({ stocks }) => {
  // Transform data for Treemap with sector grouping
  const data = useMemo(() => {
    if (!stocks || stocks.length === 0) return [];

    // Group by sector
    const sectors = stocks.reduce((acc, stock) => {
      const sector = stock.sector || 'Others';
      if (!acc[sector]) acc[sector] = [];
      acc[sector].push(stock);
      return acc;
    }, {});

    // Format for Recharts Treemap with nested structure
    return Object.entries(sectors).map(([sectorName, items]) => ({
      name: sectorName,
      children: items.map(stock => ({
        name: stock.symbol,
        size: Math.abs(stock.price * 100),
        value: Math.abs(stock.price),
        percent: stock.percent,
        symbol: stock.symbol,
        price: stock.price,
        sector: stock.sector,
        change: stock.change
      }))
    }));
  }, [stocks]);

  // TradingView-style color palette
  const getColor = (percent) => {
    if (percent >= 3) return '#00796b';    // Dark teal green - Strong gain
    if (percent >= 2) return '#009688';    // Teal green
    if (percent >= 1.5) return '#26a69a';  // Medium teal
    if (percent >= 1) return '#4db6ac';    // Light teal
    if (percent >= 0.5) return '#80cbc4';  // Pale teal
    if (percent >= 0) return '#b2dfdb';    // Very pale teal
    if (percent >= -0.5) return '#ffcdd2'; // Very pale red
    if (percent >= -1) return '#ef9a9a';   // Pale red
    if (percent >= -1.5) return '#e57373'; // Light red
    if (percent >= -2) return '#ef5350';   // Medium red
    if (percent >= -3) return '#f44336';   // Red
    return '#c62828';                       // Dark red - Strong loss
  };

  const CustomizedContent = (props) => {
    const { x, y, width, height, name, payload, depth, index } = props;

    // Sector label (depth 1)
    if (depth === 1) {
      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: 'transparent',
              stroke: '#475569',
              strokeWidth: 1,
            }}
          />
          {/* Sector Label Header */}
          <rect
            x={x}
            y={y}
            width={width}
            height={20}
            style={{
              fill: 'rgba(30, 41, 59, 0.9)',
            }}
          />
          <text
            x={x + 8}
            y={y + 14}
            fill="#94a3b8"
            fontSize={11}
            fontWeight="600"
            style={{ pointerEvents: 'none' }}
          >
            {name} ›
          </text>
        </g>
      );
    }

    // Stock block (depth 2)
    if (depth === 2) {
      // Access percent from the payload - it should be spread from the stock object
      const percent = props.percent || payload?.percent || 0;
      const symbol = props.symbol || payload?.symbol || name;

      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: getColor(percent),
              stroke: '#1e293b',
              strokeWidth: 1,
            }}
          />
          {/* Symbol */}
          {width > 35 && height > 20 && (
            <text
              x={x + width / 2}
              y={y + height / 2 - (height > 40 ? 6 : 0)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize={Math.min(width / 5, 12)}
              fontWeight="900"
              style={{ 
                pointerEvents: 'none',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}
            >
              {symbol}
            </text>
          )}
          {/* Percent Change */}
          {width > 35 && height > 40 && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize={Math.min(width / 6, 10)}
              style={{ 
                pointerEvents: 'none',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
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
      const percent = data.percent || 0;
      return (
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          padding: '12px 16px',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '14px' }}>{data.symbol}</p>
          <p style={{ margin: '0 0 4px 0', color: '#94a3b8' }}>₹{data.price?.toLocaleString('en-IN')}</p>
          <p style={{ margin: 0, color: getColor(percent), fontWeight: 'bold' }}>
            {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
          </p>
          {data.sector && <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{data.sector}</p>}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
        No data available
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          ratio={1}
          stroke="#1e293b"
          content={<CustomizedContent />}
          isAnimationActive={false}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingViewHeatmap;
