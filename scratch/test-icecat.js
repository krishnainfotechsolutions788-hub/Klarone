import https from 'https';

const ICECAT_USERNAME = process.env.ICECAT_USERNAME || "klarone"; // Fallback or empty if not needed
const ICECAT_API_TOKEN = process.env.ICECAT_API_TOKEN || "test";

const url = `https://live.icecat.biz/api?lang=en&shopname=${ICECAT_USERNAME}&content=essentialinfo&Brand=Lenovo&ProductCode=82X700M6IN`;

https.get(url, {
  headers: {
    // We don't have the real tokens here, so it might fail with auth error, but let's see.
    // If we have them in .env.local, we can read them.
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY:', data.substring(0, 500)));
}).on('error', (err) => console.error(err));
