import yahooFinance from 'yahoo-finance2';

async function test() {
  try {
    const results = await yahooFinance.quote('AAPL');
    console.log(results);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
