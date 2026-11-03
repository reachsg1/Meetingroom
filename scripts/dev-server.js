// 로컬 개발 서버: node scripts/dev-server.js  (Vercel 함수와 같은 방식으로 api/ 를 실행)
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const PORT = Number(process.env.PORT) || 3000;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    const name = url.pathname.slice(5).replace(/[^a-z0-9-]/gi, '');
    const file = path.join(root, 'api', name + '.js');
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
    let raw = '';
    for await (const chunk of req) raw += chunk;
    req.query = Object.fromEntries(url.searchParams);
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(o)); };
    res.send = (s) => res.end(s);
    return require(file)(req, res);
  }
  let p = path.join(root, 'public', decodeURIComponent(url.pathname));
  if (!p.startsWith(path.join(root, 'public'))) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
