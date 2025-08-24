import { useState } from 'react'
import './App.css'
import axios from 'axios'

const EXCHANGES = [
  { key: 'binance', name: 'Binance' },
  { key: 'bybit', name: 'Bybit' },
  { key: 'kraken', name: 'Kraken' },
  { key: 'coinbase', name: 'Coinbase' },
  { key: 'mexc', name: 'MEXC' },
  { key: 'gateio', name: 'Gate.io' },
  { key: 'okx', name: 'OKX' },
  { key: 'bitget', name: 'Bitget' },
];

function App() {
  const [arbs, setArbs] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchArbs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get('http://localhost:3001/api/orderbooks')
      const data = res.data
      const results = []
      // Käydään kaikki parit ja pörssit läpi
      Object.keys(data.binance).forEach(symbol => {
        EXCHANGES.forEach((ex1) => {
          const bid = data[ex1.key]?.[symbol]?.bestBid ? parseFloat(data[ex1.key][symbol].bestBid) : null
          if (!bid) return
          EXCHANGES.forEach((ex2) => {
            if (ex1.key === ex2.key) return
            const ask = data[ex2.key]?.[symbol]?.bestAsk ? parseFloat(data[ex2.key][symbol].bestAsk) : null
            if (!ask || ask === 0) return
            const diff = ((bid - ask) / ask) * 100
            if (diff >= 0.1) {
              results.push({
                symbol,
                buyExchange: ex2.name,
                buyPrice: ask,
                sellExchange: ex1.name,
                sellPrice: bid,
                profitPercent: diff.toFixed(2)
              })
            }
          })
        })
      })
      setArbs(results)
    } catch (err) {
      setError('Virhe haettaessa pörsseistä')
      setArbs(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Arbitrage opportunities (Binance, Bybit, Kraken, Coinbase, MEXC, Gate.io, OKX, Bitget)</h1>
      <button onClick={fetchArbs} disabled={loading}>
        {loading ? 'Loading...' : 'find arbitrages'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{'Error fetching from exchanges'}</div>}
      {arbs && arbs.length > 0 ? (
        <table style={{ marginTop: 24, width: '100%', background: '#222', color: '#0f0', borderRadius: 8 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Pair</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Buy from</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Buy price</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Sell at</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Sell price</th>
              <th style={{ textAlign: 'left', padding: 8 }}>% profit</th>
            </tr>
          </thead>
          <tbody>
            {arbs.map((arb, i) => (
              <tr key={i}>
                <td style={{ padding: 8 }}>{arb.symbol}</td>
                <td style={{ padding: 8 }}>{arb.buyExchange}</td>
                <td style={{ padding: 8 }}>{arb.buyPrice}</td>
                <td style={{ padding: 8 }}>{arb.sellExchange}</td>
                <td style={{ padding: 8 }}>{arb.sellPrice}</td>
                <td style={{ padding: 8 }}>{arb.profitPercent} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : arbs && arbs.length === 0 ? (
        <div style={{ color: '#fff', marginTop: 32, fontSize: 22 }}>No arbitrages at the moment</div>
      ) : null}
    </div>
  )
}

export default App
