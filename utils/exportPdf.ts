import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NewsletterData } from '../types';

/**
 * Builds the same HTML structure as exportHtml.ts but renders it off-screen,
 * captures it with html2canvas, and paginates the resulting image into a
 * multi-page A4 PDF that's visually identical to the in-app newsletter.
 */
export const exportToPdf = async (newsletterData: NewsletterData, topic: string): Promise<void> => {
    const { image, content, sources } = newsletterData;

    // Wait for hero image to be loaded as data URL (avoids tainted canvas / CORS issues)
    const heroDataUrl = image ? await imageToDataUrl(image) : '';

    const html = `
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fb; color: #1f2937; line-height: 1.6; }
    .wrapper { width: 780px; margin: 0 auto; padding: 32px; background-color: #f8f9fb; }
    .newsletter { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }

    .header { background: #062152; padding: 24px 40px; display: flex; align-items: center; gap: 16px; }
    .header-logo { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; }
    .header-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.2); }
    .header-subtitle { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 300; letter-spacing: 0.5px; }

    .hero-image { width: 100%; height: 280px; object-fit: cover; display: block; }

    .content { padding: 40px; }
    .content-title { font-size: 28px; font-weight: 800; color: #111827; line-height: 1.3; margin-bottom: 24px; }
    .intro { font-size: 15px; line-height: 1.85; color: #4b5563; margin-bottom: 40px; }
    .intro::first-letter { font-size: 3em; font-weight: 700; color: #1054cc; float: left; margin-right: 8px; line-height: 0.85; }

    .section-divider { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
    .section-divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); }
    .section-divider-label { font-size: 11px; font-weight: 700; color: #1054cc; letter-spacing: 2.5px; text-transform: uppercase; }

    .key-point { display: flex; align-items: flex-start; gap: 14px; padding: 16px; border-radius: 12px; background: linear-gradient(135deg, #f7f9ff, #fafbff); border: 1px solid #edf1ff; margin-bottom: 10px; }
    .key-point-number { width: 28px; height: 28px; border-radius: 8px; background: #1054cc; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .key-point-text { font-size: 15px; color: #374151; line-height: 1.6; }

    .cta-wrapper { text-align: center; margin-top: 40px; }
    .cta-button { display: inline-block; background: #1054cc; color: white; font-weight: 600; font-size: 14px; padding: 12px 36px; border-radius: 12px; text-decoration: none; }

    .disclaimer { background: #f9fafb; padding: 16px 40px; border-top: 1px solid #f0f0f0; }
    .disclaimer p { font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.6; }

    .sources { background: #ffffff; border-radius: 16px; padding: 32px 40px; margin-top: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
    .sources-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .sources-icon { width: 32px; height: 32px; border-radius: 8px; background: #062152; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 700; }
    .sources-title { font-size: 18px; font-weight: 700; color: #111827; }
    .sources-count { font-size: 11px; color: #9ca3af; background: #f3f4f6; padding: 2px 8px; border-radius: 99px; }

    .source-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; background: #f9fafb; margin-bottom: 8px; }
    .source-number { width: 24px; height: 24px; border-radius: 6px; background: rgba(16,84,204,0.1); color: #1054cc; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .source-info { min-width: 0; flex: 1; }
    .source-name { font-size: 14px; font-weight: 500; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .source-url { font-size: 12px; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

    .footer { text-align: center; padding: 24px; font-size: 11px; color: #9ca3af; }
</style>
<div class="wrapper">
    <div class="newsletter">
        <div class="header">
            <div class="header-logo">Stanton Chase</div>
            <div class="header-divider"></div>
            <div class="header-subtitle">Market Overview</div>
        </div>
        ${heroDataUrl ? `<img src="${heroDataUrl}" alt="${escapeHtml(content.title)}" class="hero-image" crossorigin="anonymous">` : ''}
        <div class="content">
            <h1 class="content-title">${escapeHtml(content.title)}</h1>
            <div class="intro">${escapeHtml(content.intro).replace(/\n/g, '<br>')}</div>

            <div class="section-divider">
                <div class="section-divider-line"></div>
                <span class="section-divider-label">Key Points</span>
                <div class="section-divider-line"></div>
            </div>

            ${content.keyPoints.map((point, i) => `
                <div class="key-point">
                    <div class="key-point-number">${i + 1}</div>
                    <div class="key-point-text">${escapeHtml(point)}</div>
                </div>
            `).join('')}

            <div class="cta-wrapper">
                <span class="cta-button">Visit Stanton Chase</span>
            </div>
        </div>
        <div class="disclaimer">
            <p>This newsletter was generated using AI-powered research tools. All information should be independently verified.</p>
        </div>
    </div>

    ${sources.length > 0 ? `
    <div class="sources">
        <div class="sources-header">
            <div class="sources-icon">S</div>
            <div class="sources-title">Sources</div>
            <span class="sources-count">${sources.filter(s => s.web).length}</span>
        </div>
        ${sources.map((source, i) => source.web ? `
            <div class="source-item">
                <div class="source-number">${i + 1}</div>
                <div class="source-info">
                    <span class="source-name">${escapeHtml(source.web.title || source.web.uri)}</span>
                    <span class="source-url">${escapeHtml(source.web.uri)}</span>
                </div>
            </div>
        ` : '').join('')}
    </div>
    ` : ''}

    <div class="footer">© ${new Date().getFullYear()} Stanton Chase. All rights reserved. · Powered by Encounte s.r.o.</div>
</div>`;

    // Mount off-screen so html2canvas can render it without affecting the live UI
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    container.style.width = '844px'; // 780 + 2 * 32 padding
    container.style.background = '#f8f9fb';
    container.innerHTML = html;
    document.body.appendChild(container);

    try {
        // Wait one tick so the browser lays out the off-screen DOM before capture
        await new Promise(resolve => setTimeout(resolve, 50));

        const canvas = await html2canvas(container, {
            scale: 2,                 // 2x for crisp output on print
            useCORS: true,
            backgroundColor: '#f8f9fb',
            logging: false,
            windowWidth: 844,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pageWidthMm = pdf.internal.pageSize.getWidth();   // 210
        const pageHeightMm = pdf.internal.pageSize.getHeight(); // 297

        // Map captured pixels → mm at the chosen page width
        const pxPerMm = canvas.width / pageWidthMm;
        const pageHeightPx = pageHeightMm * pxPerMm;

        let renderedPx = 0;

        while (renderedPx < canvas.height) {
            // Slice one page-worth of pixels off the captured canvas
            const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedPx);

            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceHeightPx;
            const ctx = sliceCanvas.getContext('2d');
            if (!ctx) throw new Error('Failed to acquire 2D context for PDF slicing');
            ctx.fillStyle = '#f8f9fb';
            ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            ctx.drawImage(
                canvas,
                0, renderedPx, canvas.width, sliceHeightPx,
                0, 0, canvas.width, sliceHeightPx
            );

            const sliceDataUrl = sliceCanvas.toDataURL('image/png');
            const sliceHeightMm = sliceHeightPx / pxPerMm;

            if (renderedPx > 0) pdf.addPage();
            pdf.addImage(sliceDataUrl, 'PNG', 0, 0, pageWidthMm, sliceHeightMm);

            renderedPx += sliceHeightPx;

            // Suppress unused warning in some bundlers
            void imgData;
        }

        const filename = `stanton_chase_newsletter_${topic.replace(/\s+/g, '_').toLowerCase()}.pdf`;
        pdf.save(filename);
    } finally {
        document.body.removeChild(container);
    }
};

/**
 * Convert an image URL (including data: URLs) into a data URL via canvas.
 * Falls back to the original URL on CORS failure so html2canvas can attempt
 * its own fetch with useCORS=true.
 */
const imageToDataUrl = (src: string): Promise<string> => {
    return new Promise((resolve) => {
        // If it's already a data URL, return it as-is.
        if (src.startsWith('data:')) {
            resolve(src);
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(src);
                    return;
                }
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } catch {
                // CORS-tainted canvas — fall back to original URL
                resolve(src);
            }
        };
        img.onerror = () => resolve(src);
        img.src = src;
    });
};

const escapeHtml = (raw: string): string =>
    raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
