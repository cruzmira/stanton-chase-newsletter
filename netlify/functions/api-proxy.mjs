export default async (request) => {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-goog-api-key',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API_KEY not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // Strip the /api-proxy prefix to get the real Google API path
  const url = new URL(request.url);
  const targetPath = url.pathname.replace(/^\/api-proxy/, '') || '/';
  const targetUrl = `https://generativelanguage.googleapis.com${targetPath}${url.search}`;

  try {
    const proxyResponse = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: (request.method !== 'GET' && request.method !== 'HEAD') ? await request.text() : undefined,
    });

    const body = await proxyResponse.text();

    return new Response(body, {
      status: proxyResponse.status,
      headers: {
        'Content-Type': proxyResponse.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
};

export const config = {
  path: "/api-proxy/*",
};
