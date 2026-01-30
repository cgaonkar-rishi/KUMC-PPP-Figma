const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Projects\\KUMC\\Figma_NextJs_Code\\KUMC-PPP-Dev-Version\\src';
const excludeDirs = new Set(['node_modules', '.next']);

const pattern = /(@\d+(\.\d+)*)(?=['"])/g;

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
                const newContent = content.replace(pattern, '');
                if (newContent !== content) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log(`Fixed imports in: ${fullPath}`);
                }
            } catch (err) {
                console.error(`Error processing ${fullPath}: ${err.message}`);
            }
        }
    }
}

walk(rootDir);
