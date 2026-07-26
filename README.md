# CustomerPulse AI

A modern, full-stack CRM dashboard application for centralized customer management, intelligent segmentation, campaign orchestration, email outreach, and real-time analytics.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)

## 🎯 Project Overview

CustomerPulse AI is a full-featured CRM platform designed to help businesses:
- Manage and organize customer data efficiently
- Create intelligent customer segments based on behavior and attributes
- Launch targeted email campaigns to specific segments
- Track campaign performance and customer analytics
- Gain actionable insights from customer interaction data

The application features a modern, responsive UI built with React and TypeScript, backed by a robust Node.js/Express API connected to PostgreSQL.

## ✨ Key Features

### Customer Management
- **Create & Manage**: Add, view, update, and delete customer records
- **Advanced Search**: Filter customers by multiple attributes
- **Batch Operations**: Manage customers in bulk
- **Customer Details**: View comprehensive customer information including order history

### Segment Management
- **Dynamic Segmentation**: Create customer groups based on criteria (VIP, High Spenders, New Customers, Lapsed Customers)
- **Segment Targeting**: Use segments for targeted campaigns
- **Flexible Rules**: Define custom segment rules based on business logic

### Campaign Management
- **Email Campaigns**: Create and send targeted email campaigns
- **Campaign Tracking**: Monitor campaign delivery and engagement
- **Channel Support**: Currently supports Email channel
- **Template Support**: Easily customize campaign messages

### Analytics & Insights
- **Dashboard Overview**: Real-time KPI metrics
- **Customer Metrics**: Total customers, segments, and active campaigns
- **Campaign Analytics**: Campaign delivery rates and performance metrics
- **Interactive Charts**: Visual representation of data trends

### User Interface
- **Modern Design**: Clean, intuitive dashboard interface
- **Responsive Layout**: Works seamlessly on desktop and tablet devices
- **Smooth Animations**: Framer Motion for polished interactions
- **Real-time Feedback**: Toast notifications and loading states

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart and analytics components
- **Lucide Icons** - Modern icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma 7** - Modern ORM with PostgreSQL adapter
- **Nodemailer** - Email service
- **dotenv** - Environment configuration

### Database
- **PostgreSQL 16** - Relational database
- **Prisma ORM** - Database abstraction and migrations

### DevOps
- **Docker & Docker Compose** - Containerization
- **Git** - Version control

## 📁 Project Structure

```
CustomerPulse-AI/
├── backend/                      # Express.js backend API
│   ├── config/
│   │   ├── db.js                # Database connection
│   │   └── prisma.js            # Prisma client setup
│   ├── controllers/             # Request handlers
│   │   ├── customerController.js
│   │   ├── segmentController.js
│   │   ├── campaignController.js
│   │   └── analyticsController.js
│   ├── models/                  # Prisma data models
│   │   ├── Customer.js
│   │   ├── Segment.js
│   │   └── Campaign.js
│   ├── routes/                  # API routes
│   │   ├── customerRoutes.js
│   │   ├── segmentRoutes.js
│   │   ├── campaignRoutes.js
│   │   └── analyticsRoutes.js
│   ├── prisma/
│   │   ├── schema.prisma        # Data schema
│   │   └── migrations/          # Database migrations
│   ├── server.js                # Express server entry point
│   ├── package.json
│   ├── .env.example             # Environment variables template
│   └── .env                     # (Git-ignored) Configuration
│
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   │   └── AnalyticsPage.tsx
│   │   │   ├── campaigns/
│   │   │   │   └── CampaignsPage.tsx
│   │   │   ├── customers/
│   │   │   │   ├── CustomersPage.tsx
│   │   │   │   ├── AddCustomerModal.tsx
│   │   │   │   └── ViewCustomerModal.tsx
│   │   │   ├── segments/
│   │   │   │   └── SegmentPage.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.tsx
│   │   │   ├── layout/
│   │   │   │   └── Sidebar.tsx
│   │   │   └── ui/
│   │   │       ├── Modal.tsx
│   │   │       ├── Button.tsx
│   │   │       ├── Toast.tsx
│   │   │       └── AIChatModal.tsx
│   │   ├── services/
│   │   │   └── api.ts           # API client
│   │   ├── data/
│   │   │   └── mockData.ts      # Test data
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .env.example
│   └── .env                     # (Git-ignored) Configuration
│
├── docker-compose.yml           # PostgreSQL container config
├── .gitignore                   # Git ignore rules
├── .env.example                 # Root environment template
└── README.md                    # This file
```

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9+ or **yarn** v3+ (comes with Node.js)
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/)) or Docker
- **Git** ([Download](https://git-scm.com/))

### Optional

- **Docker** & **Docker Compose** - For easy PostgreSQL setup

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DhineshRaj1607/CustomerPulse-AI.git
cd CustomerPulse-AI
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### 4. Setup Environment Variables

See [Environment Variables](#environment-variables) section below.

## 🗄️ Database Setup

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker compose up -d

# Verify container is running
docker compose ps
```

The PostgreSQL container will be available at `localhost:5432` with:
- Username: `customerpulse`
- Password: `customerpulse`
- Database: `customerpulse`

### Option B: Local PostgreSQL Installation

1. **Create Database**:
   ```sql
   CREATE DATABASE customerpulse;
   CREATE USER customerpulse WITH PASSWORD 'your_secure_password';
   ALTER ROLE customerpulse WITH CREATEDB;
   GRANT ALL PRIVILEGES ON DATABASE customerpulse TO customerpulse;
   ```

2. **Update Connection String**:
   Update `backend/.env` with your credentials:
   ```env
   DATABASE_URL=postgresql://customerpulse:your_secure_password@localhost:5432/customerpulse
   ```

### Run Prisma Migrations

```bash
cd backend
npx prisma migrate deploy
```

This creates the database schema automatically.

## 🔐 Environment Variables

### Backend Configuration (`backend/.env`)

Copy from `backend/.env.example`:

```env
# Database
DATABASE_URL=postgresql://customerpulse:customerpulse@localhost:5432/customerpulse

# Server
PORT=5000

# Email Service (Gmail/Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Optional
NODE_ENV=development
# CORS_ORIGIN=http://localhost:5173
# JWT_SECRET=your-secret-key
```

**Important**: For Gmail, use [App Passwords](https://myaccount.google.com/apppasswords) instead of your regular password.

### Frontend Configuration (`frontend/.env`)

Copy from `frontend/.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Optional
# VITE_ENV=development
# VITE_ENABLE_DEBUG=true
```

### Security Notes

⚠️ **Never commit `.env` files to Git!** They contain sensitive credentials.

- `.env` files are automatically excluded by `.gitignore`
- Always use environment variable files for secrets
- Use `.env.example` to document required variables
- Keep `.env.example` updated with new variable names

## ▶️ Running the Application

### Start PostgreSQL (if using Docker)

```bash
docker compose up -d
```

### Start Backend Server

```bash
cd backend
npm install      # if dependencies not installed
npm run dev      # starts on port 5000
```

Expected output:
```
Server running on http://localhost:5000
PostgreSQL Connected via Prisma
```

### Start Frontend Development Server (New Terminal)

```bash
cd frontend
npm install      # if dependencies not installed
npm run dev      # starts on port 5173
```

Access the application at `http://localhost:5173`

### Build for Production

**Frontend**:
```bash
cd frontend
npm run build    # creates dist/ folder
```

**Backend**:
No build step needed; run with `npm start` in production.

## 📡 API Endpoints

Base URL: `http://localhost:5000/api`

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Get all customers |
| GET | `/customers/:id` | Get customer by ID |
| POST | `/customers` | Create new customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

### Segments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/segments` | Get all segments |
| GET | `/segments/:id` | Get segment by ID |
| POST | `/segments` | Create new segment |
| PUT | `/segments/:id` | Update segment |
| DELETE | `/segments/:id` | Delete segment |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/campaigns` | Get all campaigns |
| GET | `/campaigns/:id` | Get campaign by ID |
| POST | `/campaigns` | Create new campaign |
| POST | `/campaigns/send-email` | Send email campaign |
| PUT | `/campaigns/:id` | Update campaign |
| DELETE | `/campaigns/:id` | Delete campaign |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics` | Get dashboard analytics |

## 🏗️ Architecture

### Frontend Architecture
- **Component-based**: Reusable UI components (Modal, Button, Toast)
- **Page-based routing**: Separate page components for each feature
- **Centralized API**: `services/api.ts` handles all backend communication
- **State management**: React hooks for local state management

### Backend Architecture
- **MVC Pattern**: Models, Controllers, Routes
- **Prisma ORM**: Type-safe database operations
- **Express Middleware**: Request handling and validation
- **Database Migrations**: Version-controlled schema changes

### Database Schema
Three main models with relationships:
- **Customer**: Stores customer information (name, email, city, order count, segment)
- **Segment**: Defines customer groups (VIP, High Spenders, New, Lapsed)
- **Campaign**: Tracks email campaigns (name, description, recipient segment, status)

## 🔒 Security Considerations

1. **Environment Variables**: Store all secrets in `.env` files (Git-ignored)
2. **CORS**: Configure proper CORS origins in production
3. **Authentication**: Currently not implemented; add JWT for multi-user access
4. **Input Validation**: Implement server-side validation for all endpoints
5. **SQL Injection**: Prisma ORM prevents SQL injection attacks
6. **Email Credentials**: Use environment variables and app-specific passwords
7. **HTTPS**: Enable in production environments
8. **Rate Limiting**: Add rate limiting for API endpoints in production

## 📸 Screenshots

[Screenshots section - add UI screenshots here]

## 🚧 Future Improvements

- [ ] User authentication and authorization
- [ ] Multi-channel campaigns (SMS, WhatsApp, Push notifications)
- [ ] Advanced email templates with drag-and-drop builder
- [ ] A/B testing for campaigns
- [ ] Advanced analytics and reporting
- [ ] Customer journey tracking
- [ ] Integration with third-party services (Stripe, Mailchimp, Zapier)
- [ ] Mobile app version
- [ ] Real-time notifications and updates
- [ ] AI-powered customer insights and recommendations
- [ ] Batch operations and imports
- [ ] Scheduled campaigns
- [ ] Campaign performance dashboards
- [ ] Data export (CSV, PDF)
- [ ] Audit logs and activity tracking

## 📝 License

[Add your license here]

## 👤 Author

Dhinesh Raj Marudaiyan - [GitHub](https://github.com/DhineshRaj1607)

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues and pull requests.

## 📧 Support

For support, open an issue on GitHub or contact the maintainer.
