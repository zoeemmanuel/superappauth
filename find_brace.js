const fs = require('fs');
const file = 'app/javascript/components/auth/UnifiedLogin.jsx';
const content = fs.readFileSync(file, 'utf8');
let openCount = 0, closeCount = 0;
let lineNum = 1;
let lastOpenBrace = 0;
let stackTrace = [];

for(let i=0; i<content.length; i++) {
  if(content[i] === '\n') lineNum++;
  if(content[i] === '{') {
    openCount++;
    stackTrace.push({type: 'open', line: lineNum});
  }
  if(content[i] === '}') {
    closeCount++;
    if(stackTrace.length > 0 && stackTrace[stackTrace.length-1].type === 'open') {
      stackTrace.pop(); // Balanced, so remove from stack
    } else {
      stackTrace.push({type: 'close', line: lineNum});
    }
  }
}

console.log(`Total: ${openCount} opening braces, ${closeCount} closing braces`);
console.log(`Brace imbalance: ${openCount - closeCount}`);

if(stackTrace.length > 0) {
  console.log("Unmatched braces:");
  stackTrace.forEach(brace => {
    console.log(`Line ${brace.line}: Unmatched ${brace.type === 'open' ? 'opening' : 'closing'} brace`);
  });
}
