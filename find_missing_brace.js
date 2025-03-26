const fs = require('fs');
const file = process.argv[2];
const content = fs.readFileSync(file, 'utf8');
let openCount = 0, closeCount = 0;
let lineNum = 1;
let lastOpenBrace = 0;
let unbalancedLocations = [];

for(let i=0; i<content.length; i++) {
  if(content[i] === '\n') lineNum++;
  if(content[i] === '{') {
    openCount++;
    if(openCount > closeCount) {
      unbalancedLocations.push({type: 'open', line: lineNum, diff: openCount - closeCount});
    }
    lastOpenBrace = lineNum;
  }
  if(content[i] === '}') {
    closeCount++;
    if(closeCount > openCount) {
      unbalancedLocations.push({type: 'close', line: lineNum, diff: closeCount - openCount});
    }
  }
}

console.log(`Total: ${openCount} opening braces, ${closeCount} closing braces`);
console.log(`Brace imbalance: ${openCount - closeCount}`);
console.log(`Last opening brace: line ${lastOpenBrace}`);

if(unbalancedLocations.length > 0) {
  console.log("Locations where braces become unbalanced:");
  unbalancedLocations.forEach(loc => {
    console.log(`Line ${loc.line}: ${loc.type === 'open' ? 'Opening' : 'Closing'} brace creates imbalance of ${loc.diff}`);
  });
}
