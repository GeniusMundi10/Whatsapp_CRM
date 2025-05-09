# Environment Setup Guide for WhatsApp Clone with CRM

## Prerequisites

Before setting up this application, ensure you have the following:

- Node.js (v16+)
- PostgreSQL database
- Pusher account (for real-time messaging)
- Cloudinary account (for image uploads)
- Optional: GitHub and Google OAuth credentials (for social login)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd WhatsAppClone
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/whatsapp_clone"

# NextAuth
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Social Logins (Optional)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Pusher (Real-time messaging)
NEXT_PUBLIC_PUSHER_APP_KEY="your-pusher-app-key"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"

# Cloudinary (Image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Zego Cloud (Voice/Video calls)
NEXT_PUBLIC_ZEGO_APP_ID="your-zego-app-id"
NEXT_PUBLIC_ZEGO_SERVER_SECRET="your-zego-server-secret"
```

### How to Get These Credentials

1. **Database URL**: Set up a PostgreSQL database and format the connection string as shown above.

2. **NextAuth Secret**: Generate a random string to use as your NextAuth secret. You can use:
   ```bash
   openssl rand -base64 32
   ```

3. **Pusher Credentials**:
   - Sign up at [Pusher](https://pusher.com/)
   - Create a new Channels app
   - Go to the "App Keys" section to find your credentials

4. **Cloudinary Credentials**:
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Navigate to the Dashboard to find your credentials

5. **Social Login Credentials** (optional):
   - GitHub: Register a new OAuth application at GitHub Developer Settings
   - Google: Create credentials in the Google Cloud Console

6. **Zego Cloud** (for voice/video calls):
   - Sign up at [Zego Cloud](https://www.zegocloud.com/)
   - Create a new project to get your credentials

## Step 4: Database Setup

Initialize the database with Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Step 5: Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run prisma:seed
```

This will create test users, conversations, and CRM data.

## Step 6: Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Default Test Accounts

After running the seed script, you can log in with these accounts:

- Email: john@example.com, Password: password123
- Email: jane@example.com, Password: password123
- Email: bob@example.com, Password: password123

## Troubleshooting

### Missing Dependencies

If you encounter errors about missing components, run:

```bash
npm install @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs cmdk
```

### Prisma Client Issues

If you encounter Prisma Client issues, try:

```bash
npx prisma generate
```

### Database Connection Errors

Ensure your PostgreSQL server is running and the connection string in `.env` is correct.

### Real-time Messaging Not Working

Check your Pusher credentials and make sure your app has the client events feature enabled. 