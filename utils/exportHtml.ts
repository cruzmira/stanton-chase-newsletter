
import { NewsletterData } from '../types';

export const exportToHtml = (newsletterData: NewsletterData, topic: string) => {
    const { image, content, sources } = newsletterData;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stanton Chase Newsletter: ${content.title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fb; color: #1f2937; line-height: 1.6; }
        .wrapper { max-width: 780px; margin: 32px auto; }
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
        .sources-icon { width: 32px; height: 32px; border-radius: 8px; background: #062152; display: flex; align-items: center; justify-content: center; }
        .sources-title { font-size: 18px; font-weight: 700; color: #111827; }
        .sources-count { font-size: 11px; color: #9ca3af; background: #f3f4f6; padding: 2px 8px; border-radius: 99px; }

        .source-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; background: #f9fafb; margin-bottom: 8px; text-decoration: none; transition: background 0.15s; }
        .source-item:hover { background: #f0f5ff; }
        .source-number { width: 24px; height: 24px; border-radius: 6px; background: rgba(16,84,204,0.1); color: #1054cc; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .source-info { min-width: 0; flex: 1; }
        .source-name { font-size: 14px; font-weight: 500; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        .source-url { font-size: 12px; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

        .footer { text-align: center; padding: 24px; font-size: 11px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="newsletter">
            <div class="header">
                <div class="header-logo">Stanton Chase</div>
                <div class="header-divider"></div>
                <div class="header-subtitle">Market Overview</div>
            </div>
            ${image ? `<img src="${image}" alt="${content.title}" class="hero-image">` : ''}
            <div class="content">
                <h1 class="content-title">${content.title}</h1>
                <div class="intro">${content.intro.replace(/\n/g, '<br>')}</div>

                <div class="section-divider">
                    <div class="section-divider-line"></div>
                    <span class="section-divider-label">Key Points</span>
                    <div class="section-divider-line"></div>
                </div>

                ${content.keyPoints.map((point, i) => `
                    <div class="key-point">
                        <div class="key-point-number">${i + 1}</div>
                        <div class="key-point-text">${point}</div>
                    </div>
                `).join('')}

                <div class="cta-wrapper">
                    <a href="https://www.stantonchase.com" class="cta-button" target="_blank">Visit Stanton Chase</a>
                </div>
            </div>
            <div class="disclaimer">
                <p>This newsletter was generated using AI-powered research tools. All information should be independently verified.</p>
            </div>
        </div>

        ${sources.length > 0 ? `
        <div class="sources">
            <div class="sources-header">
                <div class="sources-icon">
                    <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                </div>
                <div class="sources-title">Sources</div>
                <span class="sources-count">${sources.filter(s => s.web).length}</span>
            </div>
            ${sources.map((source, i) => source.web ? `
                <a href="${source.web.uri}" target="_blank" rel="noopener noreferrer" class="source-item">
                    <div class="source-number">${i + 1}</div>
                    <div class="source-info">
                        <span class="source-name">${source.web.title || source.web.uri}</span>
                        <span class="source-url">${source.web.uri}</span>
                    </div>
                </a>
            ` : '').join('')}
        </div>
        ` : ''}

        <div class="footer">© ${new Date().getFullYear()} Stanton Chase. All rights reserved. · Powered by Encounte s.r.o.</div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stanton_chase_newsletter_${topic.replace(/\s+/g, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
