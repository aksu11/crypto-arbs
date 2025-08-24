import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());

// Lista valuuttapareista
const PAIRS = [
  'XRP', 'SOL', 'ATOM', 'XLM', 'EOS', 'EGLD', 'ICP', 'FTM', 'RUNE', 'KAVA', 'GMT', 'ETH',
  'LUNC', 'TRX', 'AVAX', 'FLOW', 'DOT', 'NEAR', 'DOGE', 'XMR', 'ADA', 'LTC', 'BTC', 'LUNA', 'ALGO', 'XNO'
];




// Endpoint: Hae oikeat bid- ja ask-hinnat Binancesta ja Bitmartista kaikille pareille
app.get('/api/orderbooks', async (req, res) => {
  try {
    const binanceResults = {};
    const bybitResults = {};
    const krakenResults = {};
    // Binance
    for (const symbol of PAIRS) {
      const pair = symbol + 'USDT';
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/bookTicker', {
          params: { symbol: pair }
        });
        let bestBid = response.data.bidPrice || null;
        let bestAsk = response.data.askPrice || null;
        if (bestBid === '0.00000000') bestBid = null;
        if (bestAsk === '0.00000000') bestAsk = null;
        binanceResults[symbol] = {
          bestBid,
          bestAsk
        };
      } catch (err) {
        binanceResults[symbol] = { bestBid: null, bestAsk: null, error: 'Not found' };
      }
    }

    // Coinbase
    const coinbaseResults = {};
    for (const symbol of PAIRS) {
      // Coinbasessa pariformaatti on esim. XRP-USDT
      const pair = symbol + '-USDT';
      try {
        const response = await axios.get(`https://api.exchange.coinbase.com/products/${pair}/book`, {
          params: { level: 1 }
        });
        // bids ja asks ovat taulukoita, [0][0] on hinta
        const bids = response.data?.bids ?? [];
        const asks = response.data?.asks ?? [];
        coinbaseResults[symbol] = {
          bestBid: bids[0]?.[0] || null,
          bestAsk: asks[0]?.[0] || null
        };
      } catch (err) {
        coinbaseResults[symbol] = { bestBid: null, bestAsk: null, error: 'Not found' };
      }
    }
    // Bybit
    for (const symbol of PAIRS) {
      const pair = symbol + 'USDT';
      try {
        const response = await axios.get('https://api.bybit.com/v5/market/orderbook', {
          params: { category: 'spot', symbol: pair }
        });
        const bids = response.data?.result?.b ?? [];
        const asks = response.data?.result?.a ?? [];
        bybitResults[symbol] = {
          bestBid: bids[0]?.[0] || null,
          bestAsk: asks[0]?.[0] || null
        };
      } catch (err) {
        bybitResults[symbol] = { bestBid: null, bestAsk: null, error: 'Not found' };
      }
    }
    // Kraken
    for (const symbol of PAIRS) {
      // Krakenin pariformaatti: esim. XRPUSDT -> XXRPZUSD, BTCUSDT -> XBTUSDT, jne.
      let krakenPair = symbol + 'USDT';
      if (symbol === 'BTC') krakenPair = 'XBTUSDT';
      if (symbol === 'XRP') krakenPair = 'XXRPZUSD';
      if (symbol === 'ETH') krakenPair = 'XETHZUSD';
      // Lisää tarvittaessa muita muunnoksia
      try {
        const response = await axios.get('https://api.kraken.com/0/public/Depth', {
          params: { pair: krakenPair, count: 1 }
        });
        const data = response.data?.result;
        const pairKey = Object.keys(data)[0];
        const bids = data?.[pairKey]?.bids ?? [];
        const asks = data?.[pairKey]?.asks ?? [];
        krakenResults[symbol] = {
          bestBid: bids[0]?.[0] || null,
          bestAsk: asks[0]?.[0] || null
        };
      } catch (err) {
        krakenResults[symbol] = { bestBid: null, bestAsk: null, error: 'Not found' };
      }
    }
    // MEXC
    const mexcResults = {};
    for (const symbol of PAIRS) {
      const pair = symbol + 'USDT';
      try {
        const response = await axios.get('https://api.mexc.com/api/v3/depth', {
          params: { symbol: pair, limit: 1 }
        });
        const bids = response.data?.bids ?? [];
        const asks = response.data?.asks ?? [];
        mexcResults[symbol] = {
          bestBid: bids[0]?.[0] || null,
          bestAsk: asks[0]?.[0] || null
        };
      } catch (err) {
        mexcResults[symbol] = { bestBid: null, bestAsk: null, error: 'Not found' };
      }
    }
    // Gate.io
    const gateioResults = {};
    for (const symbol of PAIRS) {
      const pair = symbol + '_USDT';
      try {
        const response = await axios.get(`https://api.gateio.ws/api/v4/spot/order_book`, {
          params: { currency_pair: pair, limit: 1 }
        });
        const bids = response.data?.bids ?? [];
        const asks = response.data?.asks ?? [];
        gateioResults[symbol] = {
          bestBid: bids[0]?.[0] || null,
          bestAsk: asks[0]?.[0] || null
        };
      } catch (err) {
        gateioResults[symbol] = { bestBid: null, bestAsk: null, error: 'Not found' };
      }
    }
    // OKX
    const okxResults = {};
    for (const symbol of PAIRS) {
      const pair = symbol + "-USDT";
      try {
        const response = await axios.get('https://www.okx.com/api/v5/market/books', {
          params: { instId: pair, sz: 1 }
        });
        const data = response.data?.data?.[0];
        const bids = data?.bids ?? [];
        const asks = data?.asks ?? [];
        okxResults[symbol] = {
          bestBid: bids[0]?.[0] || null,
          bestAsk: asks[0]?.[0] || null
        };
      } catch (err) {
        okxResults[symbol] = { bestBid: null, bestAsk: null, error: 'Not found' };
      }
    }
    // Bitget
    const bitgetResults = {};
    for (const symbol of PAIRS) {
      const pair = symbol + "USDT_SPBL";
      try {
        const response = await axios.get('https://api.bitget.com/api/spot/v1/market/depth', {
          params: { symbol: pair, type: 'step0' }
        });
        const data = response.data?.data;
        const bids = data?.bids ?? [];
        const asks = data?.asks ?? [];
        bitgetResults[symbol] = {
          bestBid: bids[0]?.[0] || null,
          bestAsk: asks[0]?.[0] || null
        };
      } catch (err) {
        bitgetResults[symbol] = { bestBid: null, bestAsk: null, error: 'Not found' };
      }
    }
    res.json({ binance: binanceResults, bybit: bybitResults, kraken: krakenResults, coinbase: coinbaseResults, mexc: mexcResults, gateio: gateioResults, okx: okxResults, bitget: bitgetResults });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prices', details: error.message });
  }
});

// Proxy endpoint for Binance ticker price
app.get('/api/binance/ticker/price', async (req, res) => {
  const { symbol = 'BTCUSDT' } = req.query;
  try {
    const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
      params: { symbol }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Binance', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
