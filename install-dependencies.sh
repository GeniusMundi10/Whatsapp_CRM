#!/bin/bash

# Install missing Radix UI dependencies for CRM components
npm install @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs cmdk

# Regenerate Prisma client after adding new models
npx prisma generate

# Development build
npm run dev 