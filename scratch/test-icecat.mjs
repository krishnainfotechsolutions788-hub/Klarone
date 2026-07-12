import https from 'https';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually for simplicity
const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const ICECAT_USERNAME = env.ICECAT_USERNAME;
const ICECAT_API_TOKEN = env.ICECAT_API_TOKEN;

const url = `https://live.icecat.biz/api?lang=en&shopname=${ICECAT_USERNAME}&content=essentialinfo&Brand=Lenovo&ProductCode=21E6007QUS`;

console.log("Fetching URL:", url);

https.get(url, {
  headers: {
    "api-token": ICECAT_API_TOKEN
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY:', data.substring(0, 1000)));
}).on('error', (err) => console.error(err));
