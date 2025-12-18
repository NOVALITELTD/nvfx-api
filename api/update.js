// /api/update.js
let latestData = null;
let updateTime = null;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      // Validate API key
      if (data.apiKey !== 'NVTRADING2024') {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      console.log('📈 Received MT4 data:', {
        account: data.account,
        balance: data.balance,
        equity: data.equity,
        profit: data.profit,
        timestamp: new Date(data.timestamp * 1000).toISOString()
      });

      // Store data in memory (for Vercel serverless, you might want to use KV store or DB)
      latestData = data;
      updateTime = Date.now();

      // Also store in a JSON file in /public for frontend access
      // Note: In serverless, you need to use a database. For now, we'll use memory.

      return res.status(200).json({ 
        status: 'success', 
        received: true,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error processing POST:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    // Return the latest data
    return res.status(200).json({
      status: 'ok',
      data: latestData || {},
      lastUpdate: updateTime,
      message: latestData ? 'Data available' : 'No data received yet'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
