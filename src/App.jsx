import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, AlertCircle } from 'lucide-react';
import PolarHeatmap from './components/PolarHeatmap';
import './App.css';

const App = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3002/api/market/data');
      if (!response.ok) throw new Error('Failed to fetch market data');
      const data = await response.json();
      setMarketData(data);
    } catch (err) {
      setError(err.message);
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

  if (error) {
    return (
      <div className="stock-page error-container">
        <AlertCircle size={48} color="#ef4444" />
        <h3>Unable to load market data</h3>
        <p>{error}</p>
        <button onClick={fetchMarketData} className="retry-btn">Try Again</button>
      </div>
    );
  }

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
