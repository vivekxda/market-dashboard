const fetchNSE = async () => {
  try {
    const response = await fetch('https://www.nseindia.com/api/equity-stockIndices?index=NIFTY 50', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.nseindia.com/'
      }
    });
    
    if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const stock = data.data[1]; // Skip index 0 usually
            console.log('Symbol:', stock.symbol);
            console.log('Last Price:', stock.lastPrice);
            console.log('Change:', stock.change);
            console.log('pChange:', stock.pChange);
            console.log('All Keys:', Object.keys(stock).join(', '));
        }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fetchNSE();
