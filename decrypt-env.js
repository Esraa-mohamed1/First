// decrypt-env.js
const crypto = require('crypto');
const fs = require('fs');

const SECRET_KEY = process.env.ENV_SECRET;
const content = fs.readFileSync('.env.encrypted', 'utf8');
const [ivHex, encrypted] = content.split(':');

const iv = Buffer.from(ivHex, 'hex');
const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);

let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

fs.writeFileSync('.env', decrypted);
console.log('✅ Decrypted!');