const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' }, body: '' };
  }

  const GEMINI_API_KEY = process.env.API_KEY;
  if (!GEMINI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API_KEY not configured' }) };
  }

  const targetPath = event.path.replace('/.netlify/functions/api-proxy', '') || '/';
  const targetUrl = 'https://generativelanguage.googleapis.com' + targetPath;

  return new Promise((resolve) => {
    const url = new URL(targetUrl);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: event.httpMethod,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
      timeout: 120000,
    }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: { 'Content-Type': res.headers['content-type'] || 'application/json', 'Access-Control-Allow-Origin': '*' },
          body: Buffer.concat(chunks).toString('utf-8'),
        });
      });
    });
    req.on('error', (e) => resolve({ statusCode: 502, body: JSON.stringify({ error: e.message }) }));
    req.on('timeout', () => { req.destroy(); resolve({ statusCode: 504, body: JSON.stringify({ error: 'timeout' }) }); });
    if (event.body && event.httpMethod !== 'GET') req.write(event.body);
    req.end();
  });
};
