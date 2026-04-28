import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NewsletterData } from '../types';

/**
 * Renders the newsletter into an off-screen DOM, captures it with html2canvas,
 * and paginates the result into a multi-page A4 PDF.
 *
 * Pagination is "block-aware": every logical block (hero, intro, each key point,
 * each source, etc.) is annotated with data-pdf-block. We measure their bottom
 * Y-offsets in the layout, then slice the captured canvas ONLY at those
 * boundaries — guaranteeing that no card/paragraph is ever split mid-element
 * across two pages.
 */
export const exportToPdf = async (newsletterData: NewsletterData, topic: string): Promise<void> => {
    const { image, content, sources } = newsletterData;

    const heroDataUrl = image ? await imageToDataUrl(image) : '';

    const html = `
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fb; color: #1f2937; line-height: 1.6; }
    .wrapper { width: 780px; margin: 0 auto; padding: 24px 32px; background-color: #f8f9fb; }
    .newsletter { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); margin-bottom: 20px; }

    .header { background: #062152; padding: 24px 40px; display: flex; align-items: center; gap: 16px; }
    .header-logo { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; }
    .header-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.2); }
    .header-subtitle { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 300; letter-spacing: 0.5px; }

    .hero-image { width: 100%; height: 280px; object-fit: cover; display: block; }

    .content { padding: 40px; }
    .content-title { font-size: 28px; font-weight: 800; color: #111827; line-height: 1.3; margin-bottom: 24px; }
    .intro { font-size: 15px; line-height: 1.85; color: #4b5563; margin-bottom: 40px; }

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

    .sources { background: #ffffff; border-radius: 16px; padding: 32px 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); margin-bottom: 12px; }
    .sources-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .sources-icon { width: 32px; height: 32px; border-radius: 8px; background: #062152; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 700; }
    .sources-title { font-size: 18px; font-weight: 700; color: #111827; }
    .sources-count { font-size: 11px; color: #9ca3af; background: #f3f4f6; padding: 2px 8px; border-radius: 99px; }

    .source-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 16px; border-radius: 12px; background: #f9fafb; margin-bottom: 8px; }
    .source-number { width: 24px; height: 24px; border-radius: 6px; background: rgba(16,84,204,0.1); color: #1054cc; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .source-info { min-width: 0; flex: 1; word-break: break-word; overflow-wrap: anywhere; }
    .source-name { font-size: 14px; font-weight: 600; color: #1f2937; display: block; margin-bottom: 4px; line-height: 1.4; }
    .source-url { font-size: 11px; color: #6b7280; display: block; line-height: 1.4; word-break: break-all; }

    .footer { text-align: center; padding: 16px 24px 0; font-size: 11px; color: #9ca3af; }
</style>
<div class="wrapper">
    <div class="newsletter">
        <div class="header" data-pdf-block="header">
            <div class="header-logo">Stanton Chase</div>
            <div class="header-divider"></div>
            <div class="header-subtitle">Market Overview</div>
        </div>
        ${heroDataUrl ? `<img src="${heroDataUrl}" alt="${escapeHtml(content.title)}" class="hero-image" data-pdf-block="hero" crossorigin="anonymous">` : ''}
        <div class="content">
            <h1 class="content-title" data-pdf-block="title">${escapeHtml(content.title)}</h1>
            <div class="intro" data-pdf-block="intro">${escapeHtml(content.intro).replace(/\n/g, '<br>')}</div>

            <div class="section-divider" data-pdf-block="keypoints-label">
                <div class="section-divider-line"></div>
                <span class="section-divider-label">Key Points</span>
                <div class="section-divider-line"></div>
            </div>

            ${content.keyPoints.map((point, i) => `
                <div class="key-point" data-pdf-block="keypoint-${i}">
                    <div class="key-point-number">${i + 1}</div>
                    <div class="key-point-text">${escapeHtml(point)}</div>
                </div>
            `).join('')}

            <div class="cta-wrapper" data-pdf-block="cta">
                <span class="cta-button">Visit Stanton Chase</span>
            </div>
        </div>
        <div class="disclaimer" data-pdf-block="disclaimer">
            <p>This newsletter was generated using AI-powered research tools. All information should be independently verified.</p>
        </div>
    </div>

    ${sources.length > 0 ? `
    <div class="sources" data-pdf-block="sources-block">
        <div class="sources-header">
            <div class="sources-icon">S</div>
            <div class="sources-title">Sources</div>
            <span class="sources-count">${sources.filter(s => s.web).length}</span>
        </div>
        ${sources.map((source, i) => source.web ? `
            <div class="source-item" data-pdf-block="source-${i}">
                <div class="source-number">${i + 1}</div>
                <div class="source-info">
                    <span class="source-name">${escapeHtml(source.web.title || source.web.uri)}</span>
                    <span class="source-url">${escapeHtml(source.web.uri)}</span>
                </div>
            </div>
        ` : '').join('')}
    </div>
    ` : ''}

    <div class="footer" data-pdf-block="footer">© ${new Date().getFullYear()} Stanton Chase. All rights reserved. · Powered by Encounte s.r.o.</div>
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
        // Wait one tick so the browser fully lays out the off-screen DOM before measurement
        await new Promise(resolve => setTimeout(resolve, 80));

        // Collect block boundary Y-offsets (in DOM CSS pixels) before capture
        const containerRect = container.getBoundingClientRect();
        const blocks = Array.from(container.querySelectorAll<HTMLElement>('[data-pdf-block]'));
        const safeBreakPointsPx = new Set<number>();
        safeBreakPointsPx.add(0);
        for (const block of blocks) {
            const r = block.getBoundingClientRect();
            // The bottom of each block is a safe place to cut.
            // We round to integers because canvas works in integer pixel rows.
            safeBreakPointsPx.add(Math.round(r.bottom - containerRect.top));
        }
        const containerHeightPx = container.offsetHeight;
        safeBreakPointsPx.add(containerHeightPx);
        const sortedBreakPointsPx = [...safeBreakPointsPx].sort((a, b) => a - b);

        // Capture entire newsletter as one canvas
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#f8f9fb',
            logging: false,
            windowWidth: 844,
        });

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidthMm = pdf.internal.pageSize.getWidth();   // 210
        const pageHeightMm = pdf.internal.pageSize.getHeight(); // 297

        // Conversion factor: DOM CSS pixels -> canvas pixels (we used scale=2)
        const domToCanvasScale = canvas.width / container.offsetWidth;
        // Conversion: canvas pixels -> mm at the chosen page width
        const canvasPxPerMm = canvas.width / pageWidthMm;
        const pageHeightCanvasPx = pageHeightMm * canvasPxPerMm;

        // Convert safe break points from DOM px to canvas px
        const breakPointsCanvasPx = sortedBreakPointsPx.map(yPx => Math.round(yPx * domToCanvasScale));

        // Tiny breathing room at the top/bottom of each page so cards don't touch the edge
        const minSliceHeightCanvasPx = canvasPxPerMm * 5; // at least 5mm of content per slice

        let yStartCanvasPx = 0;
        let isFirstPage = true;

        while (yStartCanvasPx < canvas.height) {
            const maxYEndIdeal = yStartCanvasPx + pageHeightCanvasPx;

            // Find the largest safe break point that fits on the current page
            // (must be greater than yStart so we always make progress)
            let yEndCanvasPx = -1;
            for (const candidate of breakPointsCanvasPx) {
                if (candidate <= yStartCanvasPx) continue;
                if (candidate > maxYEndIdeal) break;
                yEndCanvasPx = candidate;
            }

            // No safe break point fits — fall back to a hard cut at the page boundary.
            // This only happens when a single block (e.g. an unusually tall card) is
            // larger than an entire A4 page, which is extremely rare in practice.
            if (yEndCanvasPx < 0 || yEndCanvasPx - yStartCanvasPx < minSliceHeightCanvasPx) {
                yEndCanvasPx = Math.min(maxYEndIdeal, canvas.height);
            }

            // Defensive: never overrun
            if (yEndCanvasPx > canvas.height) yEndCanvasPx = canvas.height;
            if (yEndCanvasPx <= yStartCanvasPx) {
                // Should be impossible, but guard against infinite loop
                yEndCanvasPx = Math.min(yStartCanvasPx + pageHeightCanvasPx, canvas.height);
                if (yEndCanvasPx <= yStartCanvasPx) break;
            }

            const sliceHeightCanvasPx = yEndCanvasPx - yStartCanvasPx;

            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceHeightCanvasPx;
            const ctx = sliceCanvas.getContext('2d');
            if (!ctx) throw new Error('Failed to acquire 2D context for PDF slicing');
            ctx.fillStyle = '#f8f9fb';
            ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            ctx.drawImage(
                canvas,
                0, yStartCanvasPx, canvas.width, sliceHeightCanvasPx,
                0, 0, canvas.width, sliceHeightCanvasPx
            );

            const sliceDataUrl = sliceCanvas.toDataURL('image/png');
            const sliceHeightMm = sliceHeightCanvasPx / canvasPxPerMm;

            if (!isFirstPage) pdf.addPage();
            pdf.addImage(sliceDataUrl, 'PNG', 0, 0, pageWidthMm, sliceHeightMm);

            yStartCanvasPx = yEndCanvasPx;
            isFirstPage = false;
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
