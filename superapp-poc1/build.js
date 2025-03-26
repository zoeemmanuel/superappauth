const execSync = require('child_process').execSync;

// Build Tailwind
console.log('Building Tailwind CSS...');
execSync('npx tailwindcss -i ./app/assets/stylesheets/application.css -o ./app/assets/builds/tailwind.css --minify');

// Build JavaScript
console.log('Building JavaScript...');
execSync('yarn build');
