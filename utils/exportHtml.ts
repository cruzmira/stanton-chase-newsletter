
import { NewsletterData } from '../types';

export const exportToHtml = (newsletterData: NewsletterData, topic: string) => {
    const { image, content, sources } = newsletterData;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CBRE Newsletter: ${content.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; margin: 0; padding: 0; background-color: #f9fafb; color: #1f2937; }
        .container { max-width: 800px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .header { background-color: #003F2D; color: white; padding: 20px; }
        .header h1 { font-size: 1.25rem; font-weight: bold; margin: 0; }
        .header p { font-size: 0.875rem; margin: 4px 0 0; }
        .main-image { width: 100%; height: auto; display: block; }
        .content { padding: 32px; }
        .content-title { font-size: 1.875rem; font-weight: bold; color: #111827; margin-top: 0; margin-bottom: 16px; }
        .intro { font-size: 1rem; line-height: 1.75; color: #374151; margin-bottom: 24px; }
        .key-points-title { font-size: 1.5rem; font-weight: bold; color: #111827; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
        .key-points-list { list-style: none; padding-left: 0; margin: 0; }
        .key-points-list li { display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 1rem; color: #374151; }
        .key-points-list svg { width: 24px; height: 24px; color: #003F2D; margin-right: 12px; flex-shrink: 0; margin-top: 2px; }
        .sources-section { padding: 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; }
        .sources-title { font-size: 1.5rem; font-weight: bold; margin-top: 0; margin-bottom: 16px; }
        .sources-list { list-style: none; padding: 0; margin: 0; }
        .sources-list li { margin-bottom: 8px; }
        .sources-list a { color: #003F2D; text-decoration: none; word-break: break-all; }
        .sources-list a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.cbre.com/-/media/cbre/countryunitedstates/images/global/cbre-logo-white.png" alt="CBRE" style="height: 32px;" />
            <p>Market Overview</p>
        </div>
        <img src="${image}" alt="Thematic image for ${content.title}" class="main-image">
        <div class="content">
            <h2 class="content-title">${content.title}</h2>
            <p class="intro">${content.intro.replace(/\n/g, '<br>')}</p>
            <h3 class="key-points-title">Key points</h3>
            <ul class="key-points-list">
                ${content.keyPoints.map(point => `
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                        <span>${point}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        ${sources.length > 0 ? `
        <div class="sources-section">
            <h3 class="sources-title">Sources</h3>
            <ul class="sources-list">
                ${sources.map(source => source.web ? `<li><a href="${source.web.uri}" target="_blank" rel="noopener noreferrer">${source.web.title || source.web.uri}</a></li>` : '').join('')}
            </ul>
        </div>
        ` : ''}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cbre_newsletter_${topic.replace(/\s+/g, '_').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
