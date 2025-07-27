#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

// Get current status
let currentStatus = false;
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  currentStatus = envContent.includes('NEXT_PUBLIC_COMING_SOON=true');
}

// Toggle status
const newStatus = !currentStatus;

// Update or create .env.local
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('NEXT_PUBLIC_COMING_SOON=')) {
    // Replace existing value
    envContent = envContent.replace(
      /NEXT_PUBLIC_COMING_SOON=(true|false)/,
      `NEXT_PUBLIC_COMING_SOON=${newStatus}`
    );
  } else {
    // Add new value
    envContent += `\n# Coming Soon Page Configuration\nNEXT_PUBLIC_COMING_SOON=${newStatus}\n`;
  }
} else {
  // Create new file
  envContent = `# Coming Soon Page Configuration\n# Set to "true" to show the coming soon page, "false" or remove to show the main site\nNEXT_PUBLIC_COMING_SOON=${newStatus}\n`;
}

fs.writeFileSync(envPath, envContent);

console.log(`✅ Coming soon page is now ${newStatus ? 'ENABLED' : 'DISABLED'}`);
console.log('🔄 Please restart your development server for changes to take effect.');

if (newStatus) {
  console.log('\n📋 To disable coming soon page:');
  console.log('   npm run toggle-coming-soon');
  console.log('   OR set NEXT_PUBLIC_COMING_SOON=false in .env.local');
} else {
  console.log('\n📋 To enable coming soon page:');
  console.log('   npm run toggle-coming-soon');
  console.log('   OR set NEXT_PUBLIC_COMING_SOON=true in .env.local');
}