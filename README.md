# Delivery SaaS Platform

A fullstack web application for delivery management SaaS that helps small to medium businesses manage their delivery operations efficiently. The platform connects businesses, delivery personnel, and customers in a seamless experience.

## 🚀 Features

### Business Dashboard
- **User Management**: Manager, dispatcher, and driver role management
- **Order Management**: Create and manage delivery orders
- **Real-time Tracking**: Live delivery tracking with geolocation
- **Driver Management**: Assign and manage delivery personnel
- **Analytics**: Delivery times, success rates, and customer satisfaction metrics
- **Customizable Zones**: Set delivery zones and pricing
- **E-commerce Integration**: Connect with Shopify, WooCommerce, and more

### Driver Mobile App (PWA)
- **Real-time Notifications**: Instant order updates
- **GPS Navigation**: Integrated route optimization
- **Proof of Delivery**: Photo and signature capture
- **Status Updates**: Track delivery progress (accepted, picked up, in transit, delivered)
- **Earnings Tracking**: Monitor income and performance
- **Communication**: Connect with customers and business
- **Receipt Upload**: Document delivery completion

### Customer Experience
- **Real-time Tracking**: Public tracking page (no login required)
- **Status Notifications**: SMS/email updates
- **Feedback System**: Rate and review deliveries
- **Address Verification**: Confirm and correct delivery addresses

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/) (Package Manager and Server)
- **Framework**: [SvelteKit 2.16.0](https://kit.svelte.dev/)
- **Database**: [SurrealDB 2.3.0](https://surrealdb.com/)
- **UI Components**: [Shadcn-svelte](https://www.shadcn-svelte.com/)
- **Icons**: [Lucide-svelte](https://lucide.dev/)
- **Authentication**: [AuthJS](https://authjs.dev/) with SurrealDB Adapter
- **Maps**: [Radar SDK](https://radar.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd delivery-saas
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

## 🚀 Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run check

# Type checking in watch mode
bun run check:watch
```

## 📁 Project Structure

```
src/
├── routes/          # SvelteKit routes and pages
├── lib/             # Shared utilities and components
├── app.html         # HTML template
├── app.css          # Global styles
├── app.d.ts         # TypeScript declarations
├── auth.ts          # Authentication configuration
└── hooks.ts         # SvelteKit hooks
```

## 🔧 Configuration

The project uses several configuration files:
- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - Shadcn-svelte configuration
- `tailwind.config.js` - Tailwind CSS configuration

## 🚀 Deployment

This project is configured to deploy with Bun. The `svelte-adapter-bun-next` adapter is used for optimal performance.

```bash
# Build the application
bun run build

# Start the production server
bun run preview
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Please contact the development team for contribution guidelines.
