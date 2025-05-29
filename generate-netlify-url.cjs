// Generate a Netlify deployment URL
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

// Read package.json to get project name
const packageJsonPath = path.join(__dirname, 'package.json');
let projectName = 'matrix-social-links';

try {
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.name) {
      projectName = packageJson.name;
    }
  }
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

// Generate a unique hash for the deployment
const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex').substring(0, 8);

// Generate Netlify URL
const netlifyUrl = `https://${projectName.replace(/[^a-zA-Z0-9]/g, '-')}-${hash}.netlify.app`;

console.log(`\n${colors.cyan}✨ Your project is ready to be deployed to Netlify!${colors.reset}\n`);
console.log(`${colors.yellow}To deploy manually:${colors.reset}`);
console.log(`1. Go to https://app.netlify.com/drop`);
console.log(`2. Drag and drop the "${colors.green}dist${colors.reset}" folder\n`);

console.log(`${colors.yellow}Your site will be available at:${colors.reset}`);
console.log(`${colors.green}${netlifyUrl}${colors.reset}\n`);

console.log(`${colors.yellow}To set up continuous deployment:${colors.reset}`);
console.log(`1. Push your code to GitHub`);
console.log(`2. Connect your repository to Netlify`);
console.log(`3. Configure build settings:`);
console.log(`   - Build command: ${colors.green}npm run build${colors.reset}`);
console.log(`   - Publish directory: ${colors.green}dist${colors.reset}\n`);

console.log(`${colors.cyan}Happy coding!${colors.reset}\n`); 