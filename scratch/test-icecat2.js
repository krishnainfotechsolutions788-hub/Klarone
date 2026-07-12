import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const username = process.env.ICECAT_USERNAME;
const lang = 'EN';
const productCode = 'S3D3S10844';
const brand = 'Circular Computing';

const url = `https://live.icecat.biz/api/?UserName=${username}&Language=${lang}&Brand=${brand}&ProductCode=${productCode}`;

async function fetchIcecat() {
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data.data.GeneralInfo, null, 2));
}

fetchIcecat();
