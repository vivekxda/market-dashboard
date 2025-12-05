import express from 'express';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';
import fs from 'fs';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Market Server is running');
});

app.get('/api/market/data', async (req, res) => {
  try {
    const yf = new yahooFinance();
    
    const indicesSymbols = [
      '^NSEI', '^BSESN', '^NSEBANK', '^CNXIT', 
      '^CNXAUTO', '^CNXMETAL', '^CNXFMCG', '^CNXPHARMA', 
      '^CNXENERGY', '^CNXREALTY', '^CNXINFRA', '^CNXPSUBANK'
    ];
    
    const stockSymbols = [
      'HDFCBANK.NS', 'ICICIBANK.NS', 'SBIN.NS', 'AXISBANK.NS', 'KOTAKBANK.NS',
      'TCS.NS', 'INFY.NS', 'HCLTECH.NS', 'WIPRO.NS', 'TECHM.NS',
      'RELIANCE.NS', 'ONGC.NS', 'NTPC.NS', 'POWERGRID.NS', 'BPCL.NS',
      'TATAMOTORS.NS', 'MARUTI.NS', 'M&M.NS', 'BAJAJ-AUTO.NS', 'EICHERMOT.NS',
      'ITC.NS', 'HINDUNILVR.NS', 'NESTLEIND.NS', 'BRITANNIA.NS', 'TATACONSUM.NS',
      'SUNPHARMA.NS', 'CIPLA.NS', 'DRREDDY.NS', 'DIVISLAB.NS', 'APOLLOHOSP.NS',
      'TATASTEEL.NS', 'HINDALCO.NS', 'JSWSTEEL.NS', 'COALINDIA.NS', 'ADANIENT.NS'
    ];

    const results = await yf.quote([...indicesSymbols, ...stockSymbols]);

    const indices = results.filter(q => indicesSymbols.includes(q.symbol)).map(q => ({
      name: getSymbolName(q.symbol),
      value: q.regularMarketPrice,
      change: q.regularMarketChange,
      percent: q.regularMarketChangePercent,
      isUp: q.regularMarketChange >= 0
    }));

    const sectorMap = {
      'Banking': ['HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK'],
      'IT': ['TCS', 'INFY', 'HCLTECH', 'WIPRO', 'TECHM'],
      'Energy': ['RELIANCE', 'ONGC', 'NTPC', 'POWERGRID', 'BPCL'],
      'Auto': ['TATAMOTORS', 'MARUTI', 'M&M', 'BAJAJ-AUTO', 'EICHERMOT'],
      'FMCG': ['ITC', 'HINDUNILVR', 'NESTLEIND', 'BRITANNIA', 'TATACONSUM'],
      'Pharma': ['SUNPHARMA', 'CIPLA', 'DRREDDY', 'DIVISLAB', 'APOLLOHOSP'],
      'Metals': ['TATASTEEL', 'HINDALCO', 'JSWSTEEL', 'COALINDIA', 'ADANIENT']
    };

    const getSector = (symbol) => {
      const cleanSymbol = symbol.replace('.NS', '');
      for (const [sector, stocks] of Object.entries(sectorMap)) {
        if (stocks.includes(cleanSymbol)) return sector;
      }
      return 'Others';
    };

    const stocks = results.filter(q => stockSymbols.includes(q.symbol)).map(q => ({
      symbol: q.symbol.replace('.NS', ''),
      name: q.shortName || q.longName,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      percent: q.regularMarketChangePercent,
      isUp: q.regularMarketChange >= 0,
      sector: getSector(q.symbol)
    }));

    stocks.sort((a, b) => b.percent - a.percent);
    const topGainers = stocks.slice(0, 5);
    const topLosers = stocks.slice(-5).reverse();

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
    try {
      fs.writeFileSync('error.log', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } catch (logError) {
      console.error('Failed to write error log:', logError);
    }
    res.status(500).json({ error: 'Failed to fetch market data: ' + error.message });
  }
});

function getSymbolName(symbol) {
  const map = {
    '^NSEI': 'NIFTY 50',
    '^BSESN': 'SENSEX',
    '^NSEBANK': 'BANK NIFTY',
    '^CNXIT': 'NIFTY IT',
    '^CNXAUTO': 'NIFTY AUTO',
    '^CNXMETAL': 'NIFTY METAL',
    '^CNXFMCG': 'NIFTY FMCG',
    '^CNXPHARMA': 'NIFTY PHARMA',
    '^CNXENERGY': 'NIFTY ENERGY',
    '^CNXREALTY': 'NIFTY REALTY',
    '^CNXINFRA': 'NIFTY INFRA',
    '^CNXPSUBANK': 'NIFTY PSU BANK'
  };
  return map[symbol] || symbol;
}

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
