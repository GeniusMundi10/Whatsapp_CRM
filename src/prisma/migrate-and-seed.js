/**
 * This script executes Prisma migrations and seeds the database.
 * Run with: node src/prisma/migrate-and-seed.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: .env file not found!');
  console.log('Please create a .env file with your database configuration.');
  console.log('See env-setup-guide.md for details.');
  process.exit(1);
}

console.log('\x1b[36m%s\x1b[0m', '🔄 Starting database migration and seeding process...');

// Step 1: Run migrations
console.log('\x1b[36m%s\x1b[0m', '1️⃣ Running database migrations...');
exec('npx prisma migrate dev --name init', (error, stdout, stderr) => {
  if (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error during migration:');
    console.error(error);
    return;
  }
  
  console.log(stdout);
  
  if (stderr) {
    console.error('\x1b[33m%s\x1b[0m', stderr);
  }
  
  console.log('\x1b[32m%s\x1b[0m', '✅ Migrations completed successfully!');
  
  // Step 2: Generate Prisma Client
  console.log('\x1b[36m%s\x1b[0m', '2️⃣ Generating Prisma Client...');
  exec('npx prisma generate', (error, stdout, stderr) => {
    if (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Error generating Prisma Client:');
      console.error(error);
      return;
    }
    
    console.log(stdout);
    
    if (stderr) {
      console.error('\x1b[33m%s\x1b[0m', stderr);
    }
    
    console.log('\x1b[32m%s\x1b[0m', '✅ Prisma Client generated successfully!');
    
    // Step 3: Seed the database
    console.log('\x1b[36m%s\x1b[0m', '3️⃣ Seeding the database with test data...');
    exec('npx ts-node src/prisma/seed.ts', (error, stdout, stderr) => {
      if (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error seeding database:');
        console.error(error);
        return;
      }
      
      console.log(stdout);
      
      if (stderr) {
        console.error('\x1b[33m%s\x1b[0m', stderr);
      }
      
      console.log('\x1b[32m%s\x1b[0m', '✅ Database seeded successfully!');
      console.log('\x1b[32m%s\x1b[0m', '🎉 All done! Your database is ready to use.');
      console.log('\x1b[36m%s\x1b[0m', 'You can now run the application with:');
      console.log('\x1b[37m%s\x1b[0m', 'npm run dev');
      console.log('\x1b[36m%s\x1b[0m', 'Test user credentials:');
      console.log('\x1b[37m%s\x1b[0m', 'Email: john@example.com, Password: password123');
      console.log('\x1b[37m%s\x1b[0m', 'Email: jane@example.com, Password: password123');
      console.log('\x1b[37m%s\x1b[0m', 'Email: bob@example.com,  Password: password123');
    });
  });
}); 