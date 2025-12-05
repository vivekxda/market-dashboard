import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle } from 'lucide-react';
import PolarHeatmap from './components/PolarHeatmap';
import './App.css';

const App = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock Data for Demo Mode (GitHub Pages)
  const mockData = {
    isDemo: true,
    isOpen: true,
    lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    indices: [
      { name: 'NIFTY 50', value: 22500.50, change: 120.50, percent: 0.54, isUp: true },
      { name: 'SENSEX', value: 74150.20, change: 350.10, percent: 0.47, isUp: true }
    ],
    stocks: [
      { symbol: 'HDFCBANK', name: 'HDFCBANK', price: 1450.00, change: 15.00, percent: 1.05, isUp: true, sector: 'Banking' },
      { symbol: 'RELIANCE', name: 'RELIANCE', price: 2950.00, change: -10.00, percent: -0.34, isUp: false, sector: 'Energy' },
      { symbol: 'TCS', name: 'TCS', price: 4100.00, change: 45.00, percent: 1.11, isUp: true, sector: 'IT' },
      { symbol: 'INFY', name: 'INFY', price: 1600.00, change: -5.00, percent: -0.31, isUp: false, sector: 'IT' },
      { symbol: 'ICICIBANK', name: 'ICICIBANK', price: 1100.00, change: 12.00, percent: 1.10, isUp: true, sector: 'Banking' },
      { symbol: 'SBIN', name: 'SBIN', price: 750.00, change: 8.00, percent: 1.08, isUp: true, sector: 'Banking' },
      { symbol: 'ITC', name: 'ITC', price: 430.00, change: 2.00, percent: 0.47, isUp: true, sector: 'FMCG' },
      { symbol: 'TATAMOTORS', name: 'TATAMOTORS', price: 980.00, change: 18.00, percent: 1.87, isUp: true, sector: 'Auto' },
      { symbol: 'SUNPHARMA', name: 'SUNPHARMA', price: 1550.00, change: -15.00, percent: -0.96, isUp: false, sector: 'Pharma' },
      { symbol: 'TATASTEEL', name: 'TATASTEEL', price: 155.00, change: 1.50, percent: 0.98, isUp: true, sector: 'Metals' }
    ],
    topGainers: [
      { symbol: 'TATAMOTORS', name: 'TATAMOTORS', price: 980.00, change: 18.00, percent: 1.87, isUp: true },
      { symbol: 'TCS', name: 'TCS', price: 4100.00, change: 45.00, percent: 1.11, isUp: true },
      { symbol: 'ICICIBANK', name: 'ICICIBANK', price: 1100.00, change: 12.00, percent: 1.10, isUp: true }
    ],
    topLosers: [
      { symbol: 'SUNPHARMA', name: 'SUNPHARMA', price: 1550.00, change: -15.00, percent: -0.96, isUp: false },
      { symbol: 'RELIANCE', name: 'RELIANCE', price: 2950.00, change: -10.00, percent: -0.34, isUp: false },
      { symbol: 'INFY', name: 'INFY', price: 1600.00, change: -5.00, percent: -0.31, isUp: false }
    ]
  };

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3002/api/market/data');
      if (!response.ok) throw new Error('Failed to fetch market data');
      const data = await response.json();
      setMarketData(data);
    } catch (err) {
      console.warn('Backend unreachable, switching to Demo Mode');
      setMarketData(mockData);
      // Don't set error, so UI shows data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <div className="stock-page loading-container">
        <div className="loader"></div>
        <p>Loading Market Data...</p>
      </div>
    );
  }

  // No error block needed as we fall back to mockData

  const { indices, topGainers, topLosers } = marketData || {};
  const isOpen = marketData?.isOpen;
  const lastUpdated = marketData?.lastUpdated;

  return (
    <div className="stock-page">
      <div className="stock-header glass-panel">
        <div className="header-content">
          <div className="header-left">
            <h1>Indian Stock Market 🇮🇳</h1>
            <div className="status">
              <span className={`indicator ${isOpen ? 'live' : ''}`}></span>
              <span>Market is {isOpen ? 'Open' : 'Closed'}</span>
              <span className="divider">•</span>
              <span>Updated {lastUpdated}</span>
              {marketData?.isDemo && (
                <>
                  <span className="divider">•</span>
                  <span className="demo-badge">Demo Mode</span>
                </>
              )}
            </div>
          </div>
          <button className="refresh-btn" onClick={fetchMarketData}>
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="ticker-container glass-panel">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {[...indices || [], ...indices || []].map((index, i) => (
              <div key={i} className="ticker-item">
                <span className="ticker-name">{index.name}</span>
                <span className="ticker-value">{index.value?.toLocaleString('en-IN')}</span>
                <span className={`ticker-change ${index.isUp ? 'up' : 'down'}`}>
                  {index.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {index.change?.toFixed(2)} ({index.percent?.toFixed(2)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="market-content">
        <div className="heatmap-section glass-panel">
          <div className="section-header">
            <div className="title-group">
              <Activity size={24} className="icon-activity" />
              <h2>Market Heatmap</h2>
            </div>
          </div>
          <PolarHeatmap stocks={marketData?.stocks || []} />
        </div>

        <div className="market-movers">
          <div className="movers-section glass-panel">
            <div className="section-header">
              <div className="title-group">
                <TrendingUp size={24} className="icon-up" />
                <h2>Top Gainers</h2>
              </div>
            </div>
            <div className="stocks-list">
              {topGainers?.map((stock, i) => (
                <div key={i} className="stock-item">
                  <div className="stock-info">
                    <span className="stock-symbol">{stock.symbol}</span>
                    <span className="stock-name">{stock.name}</span>
                  </div>
                  <div className="stock-price">
                    <span className="price">₹{stock.price?.toLocaleString('en-IN')}</span>
                    <span className="change up">
                      +{stock.change?.toFixed(2)} ({stock.percent?.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="movers-section glass-panel">
            <div className="section-header">
              <div className="title-group">
                <TrendingDown size={24} className="icon-down" />
                <h2>Top Losers</h2>
              </div>
            </div>
            <div className="stocks-list">
              {topLosers?.map((stock, i) => (
                <div key={i} className="stock-item">
                  <div className="stock-info">
                    <span className="stock-symbol">{stock.symbol}</span>
                    <span className="stock-name">{stock.name}</span>
                  </div>
                  <div className="stock-price">
                    <span className="price">₹{stock.price?.toLocaleString('en-IN')}</span>
                    <span className="change down">
                      {stock.change?.toFixed(2)} ({stock.percent?.toFixed(2)}%)
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

export default App;
