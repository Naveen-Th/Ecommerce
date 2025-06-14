# E-commerce Delivery App

A comprehensive e-commerce delivery app built with React Native, Expo, and Supabase. The app supports three user roles: Customers, Store Owners, and Delivery Partners.

## Features

### �️ Customer Features
- Browse local stores and products
- Search for stores and products
- Place orders with real-time tracking
- View order history
- Rate stores and delivery partners

### 🏪 Store Owner Features
- Manage store profile and products
- Receive and process orders
- View sales analytics
- Manage inventory

### 🚚 Delivery Partner Features
- Receive delivery requests
- Track earnings and performance
- Manage availability status
- Navigate to pickup and delivery locations

## Tech Stack

- **Frontend**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth
- **Navigation**: Expo Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Update the credentials in `utils/supabase.ts`:
     ```typescript
     const supabaseUrl = "YOUR_SUPABASE_URL";
     const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
     ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Copy and paste the contents of `database_schema.sql`
   - Run the SQL to create all tables and policies

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   - For iOS: Press `i` or scan QR code with Camera app
   - For Android: Press `a` or scan QR code with Expo Go app

## Project Structure

```
app/
├── (tabs)/                 # Tab navigation groups
│   ├── customer/          # Customer screens
│   ├── store/             # Store owner screens
│   └── delivery/          # Delivery partner screens
├── _layout.tsx            # Root layout with auth handling
├── index.tsx              # Main entry point with routing logic
├── onboarding.tsx         # Onboarding screens
├── login.tsx              # Login screen
└── register.tsx           # Registration screen

components/
└── OnboardingSlide.tsx    # Onboarding slide component

store/
└── authStore.ts           # Zustand auth store

utils/
└── supabase.ts            # Supabase client and helper functions

constants/
└── onboardingData.ts      # Onboarding screen data
```

## User Registration

The app supports role-based registration:

### Customer Registration
- Full name, email, password
- Phone number
- Address and city

### Store Owner Registration
- Full name, email, password
- Phone number
- Store name and address
- Store category and description

### Delivery Partner Registration
- Full name, email, password
- Phone number
- Vehicle type
- License number

## Database Schema

The app uses the following main tables:

- **profiles**: User profiles with role-specific data
- **stores**: Store information
- **products**: Store products
- **orders**: Customer orders
- **order_items**: Individual items in orders
- **delivery_partners**: Delivery partner details
- **reviews**: Customer reviews

## Authentication Flow

1. **First Launch**: Shows onboarding screens
2. **No Auth**: Redirects to login
3. **Authenticated**: Redirects to role-specific dashboard
   - Customers → Customer tabs
   - Store Owners → Store tabs
   - Delivery Partners → Delivery tabs

## Styling

The app uses NativeWind (Tailwind CSS for React Native) for styling:

- Consistent design system
- Responsive layouts
- Dark/light mode support
- Custom color palette

## State Management

Zustand is used for global state management:

- Authentication state
- User profile data
- Onboarding completion status
- Session management

## Real-time Features

Supabase provides real-time capabilities:

- Order status updates
- Delivery tracking
- Inventory updates
- Chat between users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email [your-email@example.com] or create an issue in the repository.
# Ecommerce
