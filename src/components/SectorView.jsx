import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import TopMoversModal from './TopMoversModal';

const SectorView = ({ stocks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);

  // Group stocks by sector and get top gainers/losers
  const sectorData = useMemo(() => {
    if (!stocks || stocks.length === 0) return [];

    const sectors = stocks.reduce((acc, stock) => {
      const sector = stock.sector || 'Others';
      if (!acc[sector]) acc[sector] = [];
      acc[sector].push(stock);
      return acc;
    }, {});

    // For each sector, get top 100 gainers and top 100 losers
    const sectorList = Object.entries(sectors).map(([sectorName, items]) => {
      const sorted = [...items].sort((a, b) => b.percent - a.percent);
      const gainers = sorted.filter(s => s.percent >= 0).slice(0, 100);
      const losers = sorted.filter(s => s.percent < 0).slice(-100).reverse();
      
      return {
        name: sectorName,
        gainers,
        losers,
        allStocks: sorted
      };
    });

    // Define custom sector order
    const sectorOrder = [
      'Banking', 'IT', 'FMCG', 'Pharma', 'Power', 'Energy', 
      'Auto', 'Metals', 'Infrastructure', 'Finance', 'Healthcare',
      'Technology', 'Telecom', 'Realty', 'Media', 'Oil & Gas',
      'Consumer Durables', 'Services', 'Others'
    ];

    // Sort sectors by custom order
    return sectorList.sort((a, b) => {
      const indexA = sectorOrder.indexOf(a.name);
      const indexB = sectorOrder.indexOf(b.name);
      
      // If sector not in order list, put it at the end
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      
      return indexA - indexB;
    });
  }, [stocks]);

  const getColor = (percent) => {
    if (percent >= 0) return '#14b8a6';
    return '#f43f5e';
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      overflowY: 'auto',
      padding: '1rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem',
      alignContent: 'start'
    }}>
      {sectorData.map((sector) => (
        <div key={sector.name} style={{
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '8px',
          padding: '1rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Sector Header - Clickable */}
          <h3 
            onClick={() => {
              setSelectedSector(sector);
              setIsModalOpen(true);
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              paddingBottom: '0.5rem',
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
          >
            {sector.name} ›
          </h3>

          {/* Top Gainers */}
          {sector.gainers.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.75rem',
                color: '#10b981'
              }}>
                <TrendingUp size={14} />
                <span>Top Gainers</span>
              </div>
              {sector.gainers.map((stock) => (
                <div key={stock.symbol} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '4px',
                  marginBottom: '0.25rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                      {stock.symbol}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      ₹{stock.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: getColor(stock.percent) }}>
                      +{stock.percent.toFixed(2)}%
                    </span>
                    <span style={{ fontSize: '0.7rem', color: getColor(stock.percent) }}>
                      +₹{stock.change?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Top Losers */}
          {sector.losers.length > 0 && (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.75rem',
                color: '#ef4444'
              }}>
                <TrendingDown size={14} />
                <span>Top Losers</span>
              </div>
              {sector.losers.map((stock) => (
                <div key={stock.symbol} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '4px',
                  marginBottom: '0.25rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                      {stock.symbol}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      ₹{stock.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: getColor(stock.percent) }}>
                      {stock.percent.toFixed(2)}%
                    </span>
                    <span style={{ fontSize: '0.7rem', color: getColor(stock.percent) }}>
                      ₹{stock.change?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <TopMoversModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        sectorData={selectedSector}
      />
    </div>
  );
};

export default SectorView;
