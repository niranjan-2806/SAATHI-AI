const fs = require('fs');
const content = fs.readFileSync('src/components/AssistantChat.tsx', 'utf8');

console.log('File length:', content.length);

for (let i = 0; i < content.length; i++) {
  const code = content.charCodeAt(i);
  
  // Skip standard printable ASCII and standard spacing
  if (code >= 32 && code <= 126) continue;
  if (code === 9 || code === 10 || code === 13) continue;
  
  // Skip Hindi (Devanagari)
  if (code >= 0x0900 && code <= 0x097F) continue;
  
  // Skip Tamil
  if (code >= 0x0B80 && code <= 0x0BFF) continue;
  
  // Skip Telugu
  if (code >= 0x0C00 && code <= 0x0C7F) continue;
  
  // Print anything else with surrounding context
  const start = Math.max(0, i - 15);
  const end = Math.min(content.length, i + 15);
  const context = content.substring(start, end).replace(/\n/g, ' ');
  console.log(`Weird Char code ${code.toString(16)} (decimal ${code}) at index ${i}: "${content[i]}" context: "...${context}..."`);
}
