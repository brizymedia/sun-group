/* index.html + style.css + app.js + 사진(base64) 를 한 파일로 합친다.
   실행: node tools/build_single.js  →  썬그룹-홈페이지.html */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const mime = { webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml' };
const dataUri = (p) => {
  const ext = p.split('.').pop();
  return 'data:' + mime[ext] + ';base64,' + fs.readFileSync(path.join(ROOT, p)).toString('base64');
};

let html = read('index.html');
let css = read('assets/style.css');
let js = read('assets/app.js');

// CSS 안의 url(img/…) → data URI
css = css.replace(/url\((img\/[^)]+)\)/g, (m, p) => 'url(' + dataUri('assets/' + p) + ')');
// HTML 의 src="assets/img/…" → data URI (og:image 는 절대 주소라 그대로)
html = html.replace(/(src|href)="(assets\/img\/[^"]+)"/g, (m, attr, p) => attr + '="' + dataUri(p) + '"');
// 링크 → 인라인
html = html.replace('<link rel="stylesheet" href="assets/style.css">', '<style>\n' + css + '\n</style>');
html = html.replace('<script src="assets/app.js"></script>', '<script>\n' + js + '\n</script>');

const out = path.join(ROOT, '썬그룹-홈페이지.html');
fs.writeFileSync(out, html);
console.log('wrote', out, (fs.statSync(out).size / 1024 / 1024).toFixed(2) + 'MB');
