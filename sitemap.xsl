<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sitemap — KuroLabs AI</title>
        <style>
          :root {
            --bg: #070b14;
            --surface: #0c1222;
            --border: rgba(255,255,255,0.08);
            --cyan: #06b6d4;
            --text: #cbd5e1;
            --muted: #64748b;
            --white: #f8fafc;
            --emerald: #10b981;
            --font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
            --font-mono: 'Cascadia Code', 'JetBrains Mono', 'Fira Code', monospace;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: var(--bg);
            color: var(--text);
            font-family: var(--font-sans);
            font-size: 14px;
            line-height: 1.6;
            min-height: 100vh;
          }
          a { color: var(--cyan); text-decoration: none; }
          a:hover { text-decoration: underline; opacity: 0.85; }

          .header {
            background: rgba(12,18,34,0.95);
            border-bottom: 1px solid var(--border);
            padding: 20px 40px;
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .header-logo {
            font-family: var(--font-mono);
            font-size: 16px;
            font-weight: 700;
            color: var(--white);
            letter-spacing: -0.5px;
          }
          .header-logo span { color: var(--cyan); }
          .header-badge {
            font-size: 10px;
            font-family: var(--font-mono);
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 9999px;
            background: rgba(6,182,212,0.1);
            border: 1px solid rgba(6,182,212,0.3);
            color: var(--cyan);
          }
          .header-home {
            margin-left: auto;
            font-size: 12px;
            color: var(--cyan);
            font-family: var(--font-mono);
          }

          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 24px 60px;
          }

          .page-title {
            font-size: 28px;
            font-weight: 700;
            color: var(--white);
            letter-spacing: -0.5px;
            margin-bottom: 4px;
          }
          .page-sub {
            font-size: 13px;
            color: var(--muted);
            margin-bottom: 32px;
          }
          .page-sub span {
            font-family: var(--font-mono);
            color: var(--cyan);
          }

          .stat-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 28px;
          }
          .stat-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-family: var(--font-mono);
            padding: 5px 12px;
            border-radius: 9999px;
            background: rgba(255,255,255,0.04);
            border: 1px solid var(--border);
            color: var(--text);
          }
          .dot-green { width: 7px; height: 7px; border-radius: 50%; background: var(--emerald); }
          .dot-cyan  { width: 7px; height: 7px; border-radius: 50%; background: var(--cyan); }

          table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(12,18,34,0.6);
            border: 1px solid var(--border);
            border-radius: 16px;
            overflow: hidden;
          }
          thead tr {
            background: rgba(6,182,212,0.06);
            border-bottom: 1px solid var(--border);
          }
          th {
            padding: 12px 16px;
            font-size: 10px;
            font-family: var(--font-mono);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--muted);
            text-align: left;
          }
          td {
            padding: 13px 16px;
            font-size: 12px;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: rgba(6,182,212,0.04); }

          .url-cell { font-family: var(--font-mono); font-size: 11px; }
          .priority-high   { color: var(--emerald); font-family: var(--font-mono); font-weight: 600; font-size: 11px; }
          .priority-medium { color: var(--cyan);    font-family: var(--font-mono); font-weight: 600; font-size: 11px; }
          .priority-low    { color: var(--muted);   font-family: var(--font-mono); font-weight: 600; font-size: 11px; }
          .freq-pill {
            display: inline-block;
            font-size: 10px;
            font-family: var(--font-mono);
            padding: 2px 8px;
            border-radius: 9999px;
            background: rgba(255,255,255,0.04);
            border: 1px solid var(--border);
            color: var(--text);
          }

          .footer {
            text-align: center;
            font-size: 11px;
            font-family: var(--font-mono);
            color: var(--muted);
            margin-top: 40px;
          }
          .footer a { color: var(--cyan); }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-logo">KURO<span>LABS</span> AI</div>
          <div class="header-badge">SITEMAP</div>
          <a class="header-home" href="/">← Back to Site</a>
        </div>

        <div class="container">
          <div class="page-title">XML Sitemap</div>
          <div class="page-sub">
            Search engine index for
            <span>kurolabs-ai.github.io</span>
            &bull; Generated 2026-10-11
          </div>

          <div class="stat-row">
            <div class="stat-pill">
              <span class="dot-green"></span>
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs indexed
            </div>
            <div class="stat-pill">
              <span class="dot-cyan"></span>
              robots.txt active
            </div>
            <div class="stat-pill">
              <span class="dot-cyan"></span>
              SEO meta tags on all pages
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Page URL</th>
                <th>Last Modified</th>
                <th>Change Freq</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <xsl:sort select="sitemap:priority" order="descending" data-type="number"/>
                <tr>
                  <td style="color:#475569;font-family:var(--font-mono);font-size:11px;">
                    <xsl:value-of select="position()"/>
                  </td>
                  <td class="url-cell">
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td style="color:#64748b;font-family:var(--font-mono);font-size:11px;">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                  <td>
                    <span class="freq-pill"><xsl:value-of select="sitemap:changefreq"/></span>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority >= 0.9">
                        <span class="priority-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority >= 0.7">
                        <span class="priority-medium"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority-low"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <div class="footer">
            <a href="https://github.com/kuroLabs-ai/KuroCodeAgent" target="_blank">KuroLabs AI</a>
            &bull; MIT Open Source &bull; &copy; 2026
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
