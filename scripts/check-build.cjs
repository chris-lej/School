const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'dist');
const html = path.join(root, 'index.html');
if (!fs.existsSync(html)) {
  throw new Error('Build missing dist/index.html');
}
const markup = fs.readFileSync(html, 'utf8');
const scripts = [...markup.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(match => match[1]);
if (scripts.length === 0) {
  throw new Error('Build has no JavaScript entrypoint');
}
for (const url of scripts) {
  if (/^https?:\/\//.test(url)) continue;
  const local = path.join(root, url.replace(/^\//, '').split('?')[0]);
  if (!fs.existsSync(local)) {
    throw new Error('Missing referenced script: ' + url);
  }
}
console.log('Static build verified: index.html and ' + scripts.length + ' script(s) exist.');
