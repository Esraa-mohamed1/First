// encrypt-env.js
import crypto from 'crypto';
import fs from 'fs';

const SECRET_KEY = process.env.ENV_SECRET;

// Guard clause — fail fast with a helpful message
if (!SECRET_KEY || SECRET_KEY.length !== 32) {
    console.error('❌ ENV_SECRET must be set and exactly 32 characters long.');
    console.error(`   Current value: ${SECRET_KEY === undefined ? 'undefined' : `"${SECRET_KEY}" (${SECRET_KEY.length} chars)`}`);
    process.exit(1);
}

const iv = crypto.randomBytes(16);
const content = fs.readFileSync('.env', 'utf8');
const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), iv);

let encrypted = cipher.update(content, 'utf8', 'hex');
encrypted += cipher.final('hex');

const result = iv.toString('hex') + ':' + encrypted;
fs.writeFileSync('.env.encrypted', result);
console.log('✅ Encrypted!');