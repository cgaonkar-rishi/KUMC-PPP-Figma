const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Projects\\KUMC\\Figma_NextJs_Code\\KUMC-PPP-Dev-Version\\src';
const excludeDirs = new Set(['node_modules', '.next']);

const pattern = /from\s+['"](.*)@\d+(\.\d+)*['"]/g;
const packages = new Set();

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!excludeDirs.has(file)) {
                walk(fullPath);
            }
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    packages.add(match[1]);
                }
            } catch (err) {
                console.error(`Error processing ${fullPath}: ${err.message}`);
            }
        }
    }
}

walk(rootDir);
console.log('PACKAGES_TO_INSTALL:');
console.log(Array.from(packages).join(' '));
