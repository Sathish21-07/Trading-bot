import { useState } from 'react';
import './App.css';

const API_BASE = 'http://127.0.0.1:8000';

function App() {
  const [tab, setTab] = useState('market');

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h1>Trading Bot Dashboard</h1>
          <p className="subtitle">Binance Futures Testnet</p>
        </div>

        <div className="tabs">
          <button className={tab === 'market' ? 'tab active' : 'tab'} onClick={() => setTab('market')}>Market</button>
          <button className={tab === 'limit' ? 'tab active' : 'tab'} onClick={() => setTab('limit')}>Limit</button>
          <button className={tab === 'oco' ? 'tab active' : 'tab'} onClick={() => setTab('oco')}>OCO</button>
          <button className={tab === 'twap' ? 'tab active' : 'tab'} onClick={() => setTab('twap')}>TWAP</button>
          <button className={tab === 'logs' ? 'tab active' : 'tab'} onClick={() => setTab('logs')}>Logs</button>
        </div>

        {tab === 'market' && <MarketOrderForm />}
        {tab === 'limit' && <LimitOrderForm />}
        {tab === 'oco' && <OcoOrderForm />}
        {tab === 'twap' && <TwapOrderForm />}
        {tab === 'logs' && <LogsView />}
      </div>
    </div>
  );
}

function MarketOrderForm() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState('0.01');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE}/place-market-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, side, quantity: parseFloat(quantity) }),
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="form-group">
        <label>Symbol</label>
        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group half">
          <label>Side</label>
          <select value={side} onChange={(e) => setSide(e.target.value)} className={side === 'BUY' ? 'side-buy' : 'side-sell'}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div className="form-group half">
          <label>Quantity</label>
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
      </div>
      <button className={side === 'BUY' ? 'btn btn-buy' : 'btn btn-sell'} onClick={placeOrder} disabled={loading}>
        {loading ? 'Placing Order...' : `Place ${side} Market Order`}
      </button>
      <ResultBox result={result} />
    </div>
  );
}

function LimitOrderForm() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState('0.01');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE}/place-limit-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, side, quantity: parseFloat(quantity), price: parseFloat(price) }),
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="form-group">
        <label>Symbol</label>
        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group half">
          <label>Side</label>
          <select value={side} onChange={(e) => setSide(e.target.value)} className={side === 'BUY' ? 'side-buy' : 'side-sell'}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div className="form-group half">
          <label>Quantity</label>
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Limit Price</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 60000" />
      </div>
      <button className={side === 'BUY' ? 'btn btn-buy' : 'btn btn-sell'} onClick={placeOrder} disabled={loading || !price}>
        {loading ? 'Placing Order...' : `Place ${side} Limit Order`}
      </button>
      <ResultBox result={result} />
    </div>
  );
}

function OcoOrderForm() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState('SELL');
  const [quantity, setQuantity] = useState('0.01');
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE}/place-oco-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          side,
          quantity: parseFloat(quantity),
          take_profit_price: parseFloat(takeProfitPrice),
          stop_loss_price: parseFloat(stopLossPrice),
        }),
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  return (
    <div>
      <p className="hint">Closes an existing position. Side = the side that CLOSES it (LONG position → SELL).</p>
      <div className="form-group">
        <label>Symbol</label>
        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group half">
          <label>Close Side</label>
          <select value={side} onChange={(e) => setSide(e.target.value)} className={side === 'BUY' ? 'side-buy' : 'side-sell'}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div className="form-group half">
          <label>Quantity</label>
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group half">
          <label>Take-Profit Price</label>
          <input value={takeProfitPrice} onChange={(e) => setTakeProfitPrice(e.target.value)} placeholder="e.g. 65000" />
        </div>
        <div className="form-group half">
          <label>Stop-Loss Price</label>
          <input value={stopLossPrice} onChange={(e) => setStopLossPrice(e.target.value)} placeholder="e.g. 58000" />
        </div>
      </div>
      <button className="btn btn-neutral" onClick={placeOrder} disabled={loading || !takeProfitPrice || !stopLossPrice}>
        {loading ? 'Placing OCO...' : 'Place OCO Order'}
      </button>
      <ResultBox result={result} />
    </div>
  );
}

function TwapOrderForm() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [side, setSide] = useState('BUY');
  const [totalQuantity, setTotalQuantity] = useState('0.05');
  const [numChunks, setNumChunks] = useState('5');
  const [intervalSeconds, setIntervalSeconds] = useState('10');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`${API_BASE}/place-twap-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          side,
          total_quantity: parseFloat(totalQuantity),
          num_chunks: parseInt(numChunks),
          interval_seconds: parseInt(intervalSeconds),
        }),
      });
      setResult(await response.json());
    } catch (error) {
      setResult({ success: false, error: error.message });
    }
    setLoading(false);
  };

  const totalTime = parseInt(numChunks || 0) * parseInt(intervalSeconds || 0);

  return (
    <div>
      <p className="hint">Splits the order into smaller chunks placed over time. This will take ~{totalTime}s to complete.</p>
      <div className="form-group">
        <label>Symbol</label>
        <input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group half">
          <label>Side</label>
          <select value={side} onChange={(e) => setSide(e.target.value)} className={side === 'BUY' ? 'side-buy' : 'side-sell'}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>
        <div className="form-group half">
          <label>Total Quantity</label>
          <input value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group half">
          <label>Number of Chunks</label>
          <input value={numChunks} onChange={(e) => setNumChunks(e.target.value)} />
        </div>
        <div className="form-group half">
          <label>Interval (seconds)</label>
          <input value={intervalSeconds} onChange={(e) => setIntervalSeconds(e.target.value)} />
        </div>
      </div>
      <button className={side === 'BUY' ? 'btn btn-buy' : 'btn btn-sell'} onClick={placeOrder} disabled={loading}>
        {loading ? `Running TWAP (~${totalTime}s)...` : `Start ${side} TWAP`}
      </button>
      <ResultBox result={result} />
    </div>
  );
}

function LogsView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/logs`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      setLogs([`Error fetching logs: ${error.message}`]);
    }
    setLoading(false);
  };

  return (
    <div>
      <button className="btn btn-neutral" onClick={fetchLogs} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Logs'}
      </button>
      <div className="logs-box">
        {logs.length === 0 ? (
          <p className="logs-empty">No logs loaded yet. Click "Refresh Logs".</p>
        ) : (
          logs.map((line, i) => <div key={i} className="log-line">{line}</div>)
        )}
      </div>
    </div>
  );
}

function ResultBox({ result }) {
  if (!result) return null;
  return (
    <div className={`result ${result.success ? 'result-success' : 'result-error'}`}>
      <div className="result-title">{result.success ? '✓ Success' : '✗ Failed'}</div>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default App;