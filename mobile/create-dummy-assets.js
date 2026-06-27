const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// 1x1 transparent PNG base64
const dummyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(dummyPngBase64, 'base64');

const files = ['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'];

files.forEach(file => {
  fs.writeFileSync(path.join(assetsDir, file), buffer);
  console.log(`Created dummy asset: assets/${file}`);
});
