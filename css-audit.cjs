const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src', 'styles');
const variablesFile = path.join(__dirname, 'src', 'variables.css');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Properties to target
    const propsToProcess = [
        'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'gap', 'row-gap', 'column-gap',
        'width', 'min-width', 'max-width',
        'height', 'min-height', 'max-height',
        'top', 'right', 'bottom', 'left',
        'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
        'font-size', 'line-height'
    ];
    
    const replacer = (m, numStr) => {
        let num = parseFloat(numStr);
        // Only round values > 2px, so 1px, 2px borders/details stay as is unless explicitly part of targeted property
        // For distances, round magnitude up to nearest multiple of 4
        if (Math.abs(num) > 2 && Math.abs(num) % 4 !== 0) {
            let rounded = Math.ceil(Math.abs(num) / 4) * 4;
            return (num < 0 ? -rounded : rounded) + 'px';
        }
        return m;
    };

    // 1. Process CSS Variables Definition
    content = content.replace(/(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g, (match, varName, varValue) => {
        if (!varName.includes('alpha') && varValue.includes('px')) {
             const newVal = varValue.replace(/(-?\d+(?:\.\d+)?)px/g, replacer);
             return `${varName}: ${newVal};`;
        }
        return match;
    });

    // 2. Process specific properties
    const regexStr = `(?:^|\\s)(${propsToProcess.join('|')})\\s*:\\s*([^;]+);`;
    const regex = new RegExp(regexStr, 'gi');
    
    content = content.replace(regex, (match, propName, propValue) => {
        const newVal = propValue.replace(/(-?\d+(?:\.\d+)?)px/g, replacer);
        return match.replace(propValue, newVal);
    });
    
    // 3. Process transforms (like translateY)
    content = content.replace(/transform\s*:\s*([^;]+);/g, (match, propValue) => {
        const newVal = propValue.replace(/(-?\d+(?:\.\d+)?)px/g, replacer);
        return match.replace(propValue, newVal);
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Processed: ${filePath}`);
}

// Process variables
if (fs.existsSync(variablesFile)) {
    processFile(variablesFile);
}

// Process styles dir
if (fs.existsSync(cssDir)) {
    const files = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    for (const f of files) {
        processFile(path.join(cssDir, f));
    }
}

console.log('CSS Audit complete.');
