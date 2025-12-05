import React from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

const TopMoversModal = ({ isOpen, onClose, sectorData }) => {
  if (!isOpen || !sectorData) return null;

  // Get top 100 gainers and losers from the selected sector
  const sorted = [...(sectorData.allStocks || [])].sort((a, b) => b.percent - a.percent);
  const gainers = sorted.filter(s => s.percent >= 0).slice(0, 100);
  const losers = sorted.filter(s => s.percent < 0).slice(-100).reverse();

  const getColor = (percent) => {
    return percent >= 0 ? '#14b8a6' : '#f43f5e';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }} onClick={onClose}>
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1400px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(255,255,255,0.1)'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>
            {sectorData.name} - Top Movers
          </h2>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          padding: '1.5rem',
          overflow: 'hidden',
          flex: 1
        }}>
          {/* Top 100 Gainers */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#10b981',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              <TrendingUp size={20} />
              <span>Top 100 Gainers</span>
            </div>
            <div style={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              {gainers.map((stock, index) => (
                <div key={stock.symbol} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', minWidth: '2rem' }}>
                      #{index + 1}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                        {stock.symbol}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        ₹{stock.price?.toLocaleString('en-IN')}
                      </span>
                    </div>
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
          </div>

          {/* Top 100 Losers */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#ef4444',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              <TrendingDown size={20} />
              <span>Top 100 Losers</span>
            </div>
            <div style={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              {losers.map((stock, index) => (
                <div key={stock.symbol} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', minWidth: '2rem' }}>
                      #{index + 1}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                        {stock.symbol}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        ₹{stock.price?.toLocaleString('en-IN')}
                      </span>
                    </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMoversModal;
