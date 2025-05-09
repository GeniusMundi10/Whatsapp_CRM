# WhatsApp Clone with CRM

A full-featured WhatsApp clone with integrated Customer Relationship Management (CRM) functionality.

![WhatsApp Clone with CRM](public/screenshot.png)

## Features

### Messaging Features

- **Real-time Chat**: Instant messaging using Pusher for real-time communication
- **File Sharing**: Send images, documents, and voice messages
- **Voice & Video Calls**: Make voice and video calls using Zego WebRTC
- **Group Chats**: Create and manage group conversations
- **Message Search**: Search through message history
- **Emojis & Reactions**: Express yourself with emojis and reactions
- **Read Receipts**: Know when messages have been read
- **Message Status**: See delivery and read status
- **Typing Indicators**: Know when someone is typing
- **Online Status**: See when contacts are online

### CRM Features

- **Contact Information**: Store and manage contact details
- **Contact Tagging**: Categorize contacts with tags
- **Follow-up Management**: Schedule and track follow-ups
- **Message Templates**: Create and use templates for common messages
- **Contact Notes**: Add notes to contacts for important information
- **Activity Tracking**: Track interactions with contacts
- **Priority Levels**: Assign priority to contacts
- **Contact Status**: Categorize contacts as leads, customers, etc.
- **Contact Source Tracking**: Track where contacts came from

### Authentication & Security

- **User Authentication**: Secure login with email/password
- **OAuth Integration**: Sign in with Google and GitHub
- **Email Verification**: Verify user emails for security
- **Profile Management**: Update name, profile picture, and status

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Communication**: Pusher
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary
- **Voice/Video Calls**: Zego WebRTC
- **Form Handling**: React Hook Form, Yup validation
- **State Management**: Recoil, Zustand
- **Styling**: TailwindCSS with Radix UI components

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd WhatsAppClone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables as described in [env-setup-guide.md](env-setup-guide.md)

4. Initialize the database:
```bash
npm run db:setup
```

5. Start the development server:
```bash
npm run dev
```

### Running in Production

#### Windows:
```bash
.\build-and-start.bat
```

#### Unix/Linux/Mac:
```bash
./build-and-start.sh
```

## CRM Module Usage

### Contact Management

The CRM module provides a comprehensive view of your contacts:

1. **Customer Information**: Store company details, position, website, etc.
2. **Tagging System**: Categorize contacts with custom tags
3. **Follow-up Management**: Schedule follow-ups with due dates and reminders
4. **Contact Notes**: Add notes during conversations for future reference
5. **Message Templates**: Create templates for common messages

### Accessing CRM Features

- Open any conversation
- Click the "CRM" button in the chat header
- A side panel will appear with CRM features organized in tabs

## Deploying

The application can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or a custom server.

### Vercel Deployment

```bash
npm install -g vercel
vercel
```

### Custom Server Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
