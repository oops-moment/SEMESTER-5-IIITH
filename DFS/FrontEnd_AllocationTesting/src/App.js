import React, { useState } from 'react';
import './App.css'; // Make sure to import your CSS file

function App() {
  const [gpu, setGPU] = useState('');
  const [cpu, setCPU] = useState('');
  const [ram, setRAM] = useState('');
  const [result, setResult] = useState(null);
  const [ip, setIp] = useState('');
  const [output, setOutput] = useState("\n");

  const handleFetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/allocationapi?gpu=${gpu}&cpu=${cpu}&ram=${ram}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const data = await response.json();
      setResult({
        result: data.result,
        ip: data.ip
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFetchDataIP = async () => {
    try {
      const response = await fetch(`http://localhost:5001/DEallocationapi?IP=${ip}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const data = await response.json();
      setOutput(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="box-container">
        <div className="input-box">
          <label>
            GPU:
            <input type="number" value={gpu} onChange={(e) => setGPU(e.target.value)} />
          </label>
          <br />
          <label>
            CPU:
            <input type="number" value={cpu} onChange={(e) => setCPU(e.target.value)} />
          </label>
          <br />
          <label>
            RAM:
            <input type="number" value={ram} onChange={(e) => setRAM(e.target.value)} />
          </label>
          <br />
          <button className="fetch-button" onClick={handleFetchData}>Fetch Data</button>

          {result && (
            <div className="result-container">
              <h2>Result:</h2>
              <p>{result.result}</p>
              {result.ip && <p>Most suitable IP: {result.ip}</p>}
            </div>
          )}
        </div>

        <div className="input-box">
          <label>
            IP:
            <input value={ip} onChange={(e) => setIp(e.target.value)} />
          </label>
          <br />
          <button className="fetch-button" onClick={handleFetchDataIP}>Deallocate</button>
          {result && (
            <div className="result-container">
              <h2>Result:</h2>
              <p>{output}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;