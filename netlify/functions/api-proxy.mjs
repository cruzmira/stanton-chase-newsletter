import https from 'https';

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-goog-api-key',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  const GEMINI_API_KEY = process.env.API_KEY;

  if (!GEMINI_API_KEY) {
    console.error('API_KEY environment variable is not set');
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'API key not configured on server' }),
    };
  }

  // Extract the Gemini API path
  // event.path = /.netlify/functions/api-proxy/v1beta/models/gemini-2.5-pro:generateContent
  const targetPath = event.path.replace('/.netlify/functions/api-proxy', '') || '/';
  const targetUrl = `https://generativelanguage.googleapis.com${targetPath}`;

  console.log(`Proxying ${event.httpMethod} to: ${targetUrl}`);

  return new Promise((resolve) => {
    const url = new URL(targetUrl);

    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      timeout: 120000,
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf-8');
        console.log(`Response status: ${res.statusCode}`);
        resolve({
          statusCode: res.statusCode,
          headers: {
            'Content-Type': res.headers['content-type'] || 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          },
          body,
        });
      });
    });

    req.on('error', (error) => {
      console.error('Proxy error:', error.message);
      resolve({
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Proxy request failed', details: error.message }),
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        statusCode: 504,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Request timed out (120s)' }),
      });
    });

    if (event.body && event.httpMethod !== 'GET') {
      req.write(event.body);
    }

    req.end();
  });
};
