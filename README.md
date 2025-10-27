# TasteLocal - South African Food Discovery Platform

A modern web application for discovering and ordering food from local South African businesses with a kasi flavor. Built with React, TypeScript, Firebase, and Tailwind CSS.

🌐 **Live Site**: [tastekasi.vercel.app](https://tastekasi.vercel.app)
📦 **GitHub Repository**: [github.com/Thuto42096/flavor-africa-connect](https://github.com/Thuto42096/flavor-africa-connect)

## 🌟 Features

### For Customers
- 🔍 **Discover Local Businesses** - Browse restaurants and food vendors in your area
- 🍽️ **View Menus** - Explore detailed menus with photos and descriptions
- 📸 **Media Gallery** - See photos and videos of dishes and restaurants
- 📖 **Business Blog** - Read stories and updates from your favorite businesses
- 🔐 **Secure Authentication** - Email/password registration with email verification
- 👤 **User Profiles** - Manage your profile and preferences
- 📱 **WhatsApp Integration** - Direct ordering via WhatsApp

### For Business Owners
- 📊 **Vendor Dashboard** - Comprehensive business management interface
- 🍽️ **Menu Management** - Add, edit, and manage menu items with photos
- 📸 **Media Gallery** - Upload and manage business photos and videos
- ⏰ **Business Hours** - Set and manage operating hours
- 📦 **Order Management** - View and track customer orders
- 🔔 **Notifications** - Receive alerts for orders, reviews, and messages
- 📝 **Blog Management** - Create and publish business blog posts
- 🎨 **Business Profile** - Customize your business information and branding

### Technical Features
- ✨ **Real-time Sync** - Live data updates across all sessions using Firestore
- 🔐 **Secure Password Hashing** - Strong password requirements with validation
- 📧 **Email Verification** - Verify user emails during registration
- 📸 **Firebase Storage** - Secure cloud storage for all images
- 🔄 **Real-time Database** - Firestore for instant data synchronization
- 🌐 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Firebase project with Auth, Firestore, and Storage enabled

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/Thuto42096/flavor-africa-connect.git

# Step 2: Navigate to the project directory
cd flavor-africa-connect

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
# Create a .env file with your Firebase configuration
# See .env.example for required variables

# Step 5: Start the development server
npm run dev
```

### Development Commands

```sh
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🛠️ Technology Stack

### Frontend
- **Vite** - Lightning-fast build tool and dev server
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications

### Backend & Database
- **Firebase Authentication** - Secure user authentication with email verification
- **Firestore** - Real-time NoSQL database with live subscriptions
- **Firebase Storage** - Cloud storage for images and media
- **Firebase Hosting** - Deployment platform

### Development Tools
- **ESLint** - Code quality and style checking
- **Vite** - Fast HMR (Hot Module Replacement)

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── MenuManagement.tsx
│   ├── MediaGallery.tsx
│   ├── BlogManagement.tsx
│   ├── FirebaseImageUpload.tsx
│   └── ...
├── contexts/           # React Context for state management
│   ├── AuthContext.tsx
│   └── BusinessContext.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── VerifyEmail.tsx
│   ├── VendorDashboard.tsx
│   └── ...
├── services/           # Business logic and API calls
│   ├── firestoreBusinessService.ts
│   ├── storageService.ts
│   ├── passwordService.ts
│   ├── emailVerificationService.ts
│   └── ...
├── lib/                # Utility functions and configurations
│   └── firebase.ts
└── App.tsx            # Main app component
```

## 🔐 Security Features

- **Password Hashing**: Firebase Auth handles server-side password hashing
- **Password Validation**: Client-side validation with strength requirements
  - Minimum 8 characters
  - Uppercase and lowercase letters
  - Numbers and special characters
  - Common password detection
- **Email Verification**: Users must verify their email before full access
- **Row-Level Security**: Firestore rules ensure users only access their data
- **Firebase Storage Security**: Images are stored securely with access controls

## 🔄 Real-time Synchronization

The application uses Firestore's real-time listeners (`onSnapshot`) to keep data synchronized:

- **User Profiles**: Real-time updates across all sessions
- **Business Data**: Live menu, orders, hours, and notifications
- **Media & Blog**: Instant updates when content is added or modified

## 📱 User Roles

### Customer
- Browse businesses and menus
- View media galleries and blog posts
- Manage profile and preferences
- Order via WhatsApp

### Business Owner
- Complete vendor dashboard
- Manage menu items with images
- Upload media and blog content
- Track orders and notifications
- Manage business hours

## 🎨 Design Philosophy

TasteLocal embraces South African kasi culture with:
- Vibrant, welcoming UI
- South African slang and cultural references
- Local business-focused features
- Community-driven approach

## 📝 Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🚀 Deployment

The application can be deployed to Firebase Hosting:

```sh
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy
```

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.
