const fetchNSE = async () => {
  try {
    // First get cookies/session
    const response = await fetch('https://www.nseindia.com/api/equity-stockIndices?index=NIFTY 50', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.nseindia.com/'
      }
    });
    
    console.log('Status:', response.status);
    if (response.ok) {
        const data = await response.json();
        // Log the first stock to see structure
        if (data.data && data.data.length > 0) {
            console.log('Stock Sample:', JSON.stringify(data.data[1], null, 2));
        } else {
            console.log('No data found in response');
            console.log('Keys:', Object.keys(data));
        }
    } else {
        console.log('Failed to fetch');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fetchNSE();
