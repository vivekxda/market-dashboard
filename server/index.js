import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Market Server is running');
});

const fetchNSEData = async () => {
  try {
    const response = await fetch('https://www.nseindia.com/api/equity-stockIndices?index=NIFTY 50', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.nseindia.com/'
      }
    });

    if (!response.ok) {
      throw new Error(`NSE API failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching NSE data:', error.message);
    return [];
  }
};

const getSector = (symbol) => {
  const sectorMap = {
    'HDFCBANK': 'Banking', 'ICICIBANK': 'Banking', 'SBIN': 'Banking', 'AXISBANK': 'Banking', 'KOTAKBANK': 'Banking',
    'TCS': 'IT', 'INFY': 'IT', 'HCLTECH': 'IT', 'WIPRO': 'IT', 'TECHM': 'IT',
    'RELIANCE': 'Energy', 'ONGC': 'Energy', 'NTPC': 'Energy', 'POWERGRID': 'Energy', 'BPCL': 'Energy',
    'TATAMOTORS': 'Auto', 'MARUTI': 'Auto', 'M&M': 'Auto', 'BAJAJ-AUTO': 'Auto', 'EICHERMOT': 'Auto',
    'ITC': 'FMCG', 'HINDUNILVR': 'FMCG', 'NESTLEIND': 'FMCG', 'BRITANNIA': 'FMCG', 'TATACONSUM': 'FMCG',
    'SUNPHARMA': 'Pharma', 'CIPLA': 'Pharma', 'DRREDDY': 'Pharma', 'DIVISLAB': 'Pharma', 'APOLLOHOSP': 'Pharma',
    'TATASTEEL': 'Metals', 'HINDALCO': 'Metals', 'JSWSTEEL': 'Metals', 'COALINDIA': 'Metals', 'ADANIENT': 'Metals'
  };
  return sectorMap[symbol] || 'Others';
};

app.get('/api/market/data', async (req, res) => {
  try {
    const rawStocks = await fetchNSEData();

    // Map NSE data to our format
    const stocks = rawStocks.slice(1).map(stock => ({ // Slice 1 to skip index summary if present
      symbol: stock.symbol,
      name: stock.symbol, // NSE doesn't provide full name in this endpoint easily, using symbol
      price: stock.lastPrice,
      change: stock.change,
      percent: stock.pChange,
      isUp: stock.change >= 0,
      sector: getSector(stock.symbol)
    }));

    // Sort by percent change
    stocks.sort((a, b) => b.percent - a.percent);

    const topGainers = stocks.slice(0, 5);
    const topLosers = stocks.slice(-5).reverse();

    // Mock indices for now (or fetch separately if needed)
    const indices = [
      { name: 'NIFTY 50', value: rawStocks[0]?.lastPrice || 0, change: rawStocks[0]?.change || 0, percent: rawStocks[0]?.pChange || 0, isUp: (rawStocks[0]?.change || 0) >= 0 },
      { name: 'SENSEX', value: 74000, change: 150, percent: 0.2, isUp: true } // Placeholder
    ];

    res.json({
      isOpen: isMarketOpen(),
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      indices,
      stocks,
      topGainers,
      topLosers
    });
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

function isMarketOpen() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  
  const day = ist.getDay();
  const hour = ist.getHours();
  const minute = ist.getMinutes();
  
  if (day === 0 || day === 6) return false;
  if (hour < 9 || (hour === 9 && minute < 15)) return false;
  if (hour > 15 || (hour === 15 && minute > 30)) return false;
  
  return true;
}

app.listen(PORT, () => {
  console.log(`Market Server running on http://localhost:${PORT}`);
});
