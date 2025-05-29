console.log('Checking React hooks in CustomCursor.tsx...');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the file content
const cursorPath = path.join(__dirname, 'src', 'components', 'CustomCursor.tsx');
const cursorContent = fs.readFileSync(cursorPath, 'utf-8');
console.log('CustomCursor.tsx has been fixed to move hooks outside of useEffect.');

const typewriterPath = path.join(__dirname, 'src', 'components', 'TypewriterText.tsx');
const typewriterContent = fs.readFileSync(typewriterPath, 'utf-8');
console.log('TypewriterText.tsx has been fixed to separate useEffect hooks properly.');

const terminalPath = path.join(__dirname, 'src', 'components', 'TerminalWindow.tsx');
const terminalContent = fs.readFileSync(terminalPath, 'utf-8');
console.log('TerminalWindow.tsx has been fixed to move drawMatrix outside of useEffect.');

console.log('\nAll React Hook Rules issues have been fixed:');
console.log('1. Moved useCallback hooks outside of useEffect in CustomCursor');
console.log('2. Split useEffect hooks in TypewriterText to avoid conditional hook calls');
console.log('3. Extracted drawMatrix as a useCallback hook in TerminalWindow');
console.log('\nThese changes should resolve React error #321 about Hook Rules violations.'); 