import express from 'express';
import axios from 'axios';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com';

if (!GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY environment variable is not set. API proxy will not work.');
}

// Rate limiting: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// API Proxy — forward /api-proxy/* to Gemini API
app.use('/api-proxy', apiLimiter, async (req, res) => {
    const targetPath = req.url; // e.g. /v1beta/models/gemini-2.5-pro:generateContent
    const targetUrl = `${GEMINI_BASE_URL}${targetPath}`;

    try {
        const headers = { ...req.headers };
        // Remove host/origin headers that would confuse the target
        delete headers.host;
        delete headers.origin;
        delete headers.referer;
        delete headers['content-length'];

        // Add API key
        headers['x-goog-api-key'] = GEMINI_API_KEY;

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.method !== 'GET' ? req.body : undefined,
            headers,
            responseType: 'arraybuffer',
            timeout: 120000, // 2 minute timeout for long generation requests
            validateStatus: () => true, // Don't throw on non-2xx
        });

        // Forward response headers
        Object.entries(response.headers).forEach(([key, value]) => {
            if (key.toLowerCase() !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(502).json({ error: 'Proxy request failed', details: error.message });
    }
});

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Create HTTP server
const server = createServer(app);

// WebSocket proxy
const wss = new WebSocketServer({ server, path: /^\/api-proxy\// });

wss.on('connection', (clientWs, req) => {
    const targetPath = req.url.replace('/api-proxy', '');
    const targetUrl = `wss://generativelanguage.googleapis.com${targetPath}`;

    console.log(`[WS] Proxying to: ${targetUrl}`);

    const geminiWs = new WebSocket(targetUrl, {
        headers: {
            'x-goog-api-key': GEMINI_API_KEY,
        },
    });

    geminiWs.on('open', () => {
        console.log('[WS] Connected to Gemini');
    });

    geminiWs.on('message', (data) => {
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(data);
        }
    });

    geminiWs.on('close', (code, reason) => {
        console.log(`[WS] Gemini closed: ${code} ${reason}`);
        clientWs.close(code, reason);
    });

    geminiWs.on('error', (error) => {
        console.error('[WS] Gemini error:', error.message);
        clientWs.close(1011, 'Upstream error');
    });

    clientWs.on('message', (data) => {
        if (geminiWs.readyState === WebSocket.OPEN) {
            geminiWs.send(data);
        }
    });

    clientWs.on('close', () => {
        geminiWs.close();
    });

    clientWs.on('error', (error) => {
        console.error('[WS] Client error:', error.message);
        geminiWs.close();
    });
});

server.listen(PORT, () => {
    console.log(`CBRE Newsletter Server running on port ${PORT}`);
    console.log(`API proxy: /api-proxy/* -> ${GEMINI_BASE_URL}/*`);
});
