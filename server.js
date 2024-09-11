// server.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5001;

// Endpoint to handle OAuth Token generation
app.post('/api/get-token', async (req, res) => {
  const { customerNumber, clientId, clientSecret } = req.body;
  
  const apiUrl = `https://as${customerNumber}.awmdm.com`;
  const accessTokenUrl = 'https://na.uemauth.vmwservices.com/connect/token';

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await axios.post(accessTokenUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    const oauthToken = response.data.access_token;
    if (!oauthToken) {
      return res.status(400).json({ error: 'Failed to retrieve OAuth token' });
    }

    res.json({ token: oauthToken, apiUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create OAuth Token', details: error.message });
  }
});

// Endpoint to create tags
app.post('/api/create-tags', async (req, res) => {
  const { apiUrl, token, groupID } = req.body;
  const createTagUrl = `${apiUrl}/API/mdm/tags/addtag`;

  const tagNames = [
    'MTD - Activated',
    'MTD - Deactivated',
    'MTD - Disconnected',
    'MTD - Pending',
    'MTD - Unreachable',
    'MTD - Threats Present',
    'MTD - Secured',
    'MTD - Low Risk',
    'MTD - Medium Risk',
    'MTD - High Risk',
    'MTD - Denylisted App',
    'MTD - PCP Disabled',
  ];

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  try {
    for (const tagName of tagNames) {
      const tagData = {
        TagAvatar: tagName,
        TagName: tagName,
        TagType: 1,
        LocationGroupId: groupID,
      };

      await axios.post(createTagUrl, tagData, { headers });
      console.log(`Tag created: ${tagName}`);
    }

    res.json({ message: 'Tags created successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tags', details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
