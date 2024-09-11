// App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [customerNumber, setCustomerNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [groupID, setGroupID] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleTokenGeneration = async () => {
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/get-token', {
        customerNumber,
        clientId,
        clientSecret,
      });

      const { token, apiUrl } = response.data;
      setMessage('OAuth token successfully retrieved.');

      // Create tags after successfully retrieving the token
      await createTags(apiUrl, token);
    } catch (error) {
      setError('Failed to retrieve OAuth token. Please check your credentials.');
    }
  };

  const createTags = async (apiUrl, token) => {
    try {
      await axios.post('http://localhost:5000/api/create-tags', {
        apiUrl,
        token,
        groupID,
      });

      setMessage('Tags created successfully.');
    } catch (error) {
      setError('Failed to create tags.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Tag Creator</h1>
      <input
        type="text"
        placeholder="Customer Environment Number"
        value={customerNumber}
        onChange={(e) => setCustomerNumber(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <input
        type="text"
        placeholder="OAuth Client ID"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="OAuth Client Secret"
        value={clientSecret}
        onChange={(e) => setClientSecret(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <input
        type="text"
        placeholder="Numerical Group ID"
        value={groupID}
        onChange={(e) => setGroupID(e.target.value)}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <button onClick={handleTokenGeneration} style={{ marginTop: '10px' }}>
        Create Tags
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
