// encrypt-env.js
const crypto = require('crypto');
const fs = require('fs');

const SECRET_KEY = process.env.ENV_SECRET; // 32 chars
const iv = crypto.randomBytes(16);

const content = fs.readFileSync('.env', 'utf8');
const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);

let encrypted = cipher.update(content, 'utf8', 'hex');
encrypted += cipher.final('hex');

const result = iv.toString('hex') + ':' + encrypted;
fs.writeFileSync('.env.encrypted', result);
console.log('✅ Encrypted!');