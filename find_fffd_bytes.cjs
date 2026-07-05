const fs = require('fs');
const buf = fs.readFileSync('src/components/AssistantChat.tsx');

let fffdCount = 0;
for (let i = 0; i < buf.length - 2; i++) {
  if (buf[i] === 0xEF && buf[i+1] === 0xBF && buf[i+2] === 0xBD) {
    console.log(`Found EF BF BD (\\uFFFD UTF-8 bytes) at byte offset ${i}`);
    fffdCount++;
  }
}

if (fffdCount === 0) {
  console.log('No EF BF BD byte sequences found.');
}
