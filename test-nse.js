const fetchNSE = async () => {
  try {
    const response = await fetch('https://www.nseindia.com/api/marketStatus', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.nseindia.com/'
      }
    });
    
    console.log('Status:', response.status);
    if (response.ok) {
        const text = await response.text();
        console.log('Body preview:', text.substring(0, 100));
    } else {
        console.log('Failed to fetch');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fetchNSE();
