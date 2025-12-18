// /api/data.js
import { promises as fs } from 'fs';
import path from 'path';

// Simple in-memory store (use a database for production)
let dataStore = null;
let history = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'GET') {
    try {
      // If you want to simulate data when none exists
      if (!dataStore) {
        const sampleData = {
          account: 71642170,
          accountName: "NV Trading Account",
          timestamp: Math.floor(Date.now() / 1000),
          balance: 1000000,
          equity: 1000000,
          margin: 0,
          marginPercent: 0,
          freeMargin: 1000000,
          gain: 0,
          absGain: 0,
          daily: 0,
          monthly: 0,
          drawdown: 0,
          highestEquity: 1000000,
          highestDate: Math.floor(Date.now() / 1000),
          profit: 0,
          interest: 0,
          deposits: 1000000,
          withdrawals: 0,
          trades: 0,
          winRate: 0,
          profitFactor: 0,
          winningTrades: 0,
          losingTrades: 0,
          totalWin: 0,
          totalLoss: 0,
          avgWin: 0,
          avgLoss: 0,
          initialBalance: 1000000,
          indicatorStart: Math.floor(Date.now() / 1000),
          apiKey: 'NVTRADING2024',
          isSample: true
        };
        
        return res.status(200).json(sampleData);
      }

      return res.status(200).json(dataStore);
      
    } catch (error) {
      console.error('Error in /api/data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    // Update data (same as /api/update)
    const newData = req.body;
    
    if (newData.apiKey !== 'NVTRADING2024') {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    dataStore = newData;
    
    // Add to history (keep last 1000 entries)
    history.push({
      ...newData,
      receivedAt: new Date().toISOString()
    });
    
    if (history.length > 1000) {
      history = history.slice(-1000);
    }

    return res.status(200).json({ status: 'success' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
