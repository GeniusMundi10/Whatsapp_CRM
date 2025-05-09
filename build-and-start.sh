#!/bin/bash

echo "Building WhatsApp Clone with CRM..."

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building application..."
npm run build

echo "Starting application..."
npm run start

echo "Application is running at http://localhost:3000" 