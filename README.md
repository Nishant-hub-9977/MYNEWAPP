# AlgoTrader - Algorithmic Trading Platform

A comprehensive algorithmic trading platform optimized for Indian markets with DhanHQ integration. Built with React, TypeScript, Node.js, and Supabase.

## 🚀 Features

### Core Trading Features
- **Sensex Straddle Strategy**: Automated option straddle execution with configurable parameters
- **Real-time Market Data**: Live Sensex pricing and market updates via DhanHQ API
- **Position Monitoring**: Real-time P&L tracking and position management
- **Risk Management**: Stop-loss controls and maximum loss limits
- **Strategy Versioning**: Save, load, and rollback strategy configurations

### Technical Features
- **Real-time Updates**: WebSocket connections for live data streaming
- **Responsive Design**: Mobile-first design with professional trading aesthetics
- **Secure Authentication**: Supabase auth with row-level security
- **Rate Limiting**: API protection with express-rate-limit
- **Error Handling**: Comprehensive error handling and logging

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- React Hook Form + Zod for form validation
- Lucide React for icons
- Socket.io for real-time updates

### Backend
- Node.js with Express.js
- Supabase for database and authentication
- DhanHQ API integration
- Helmet for security
- Rate limiting and CORS protection

### Database
- PostgreSQL via Supabase
- Row-level security (RLS)
- Real-time subscriptions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- DhanHQ API access (for live trading)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd algotrader
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
# Edit .env with your Supabase and DhanHQ credentials
```

3. **Database Setup**:
- Create a new Supabase project
- Run the SQL schema from the documentation
- Update .env with your Supabase URL and keys

4. **Start Development**:
```bash
npm run dev
```

This starts both the React frontend (http://localhost:5173) and Express backend (http://localhost:3001).

## 🏗️ Project Structure

```
algotrader/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── trading/        # Trading components
│   │   └── layout/         # Layout components
│   ├── services/
│   │   ├── supabase.js     # Supabase client and helpers
│   │   └── dhanhq.js       # DhanHQ API integration
│   ├── stores/
│   │   ├── authStore.js    # Authentication state
│   │   └── marketStore.js  # Market data state
│   └── pages/
│       └── Dashboard.jsx   # Main dashboard page
├── server/
│   └── app.js             # Express server
└── README.md
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Set up the database schema (see Database Schema section)
3. Configure Row Level Security (RLS)
4. Add your Supabase credentials to .env

### DhanHQ Integration
1. Sign up for DhanHQ API access
2. Get your API token and client ID
3. Add credentials to .env
4. The platform includes mock data for development

## 📊 Database Schema

### Core Tables
- **user_profiles**: Extended user information
- **sensex_straddle_strategies**: Strategy configurations
- **strategy_executions**: Active strategy runs
- **positions**: Trading positions and P&L

### Security
- Row Level Security (RLS) enabled on all tables
- Policies restrict access to user's own data
- Supabase Auth integration

## 🚀 Deployment

### Frontend (Netlify)
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Backend (Node.js hosting)
```bash
# Set environment variables
# Deploy server/ folder to your hosting provider
```

### Environment Variables
```bash
# Production environment
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_DHANHQ_TOKEN=your-dhanhq-token
NODE_ENV=production
```

## 📱 Features Walkthrough

### Authentication
- Email/password authentication via Supabase
- User profiles with subscription tiers
- Secure session management

### Dashboard
- Real-time market overview
- Live Sensex pricing with change indicators
- Total P&L and active strategies count
- Professional trading interface

### Sensex Straddle Strategy
- Configurable trigger points (50-1000)
- Maximum loss limits (₹1,000-₹100,000)
- Stop-loss percentage controls
- Execution day and time scheduling
- Real-time position monitoring

### Position Management
- Live P&L tracking
- Position details with entry/current prices
- Color-coded profit/loss indicators
- Margin and risk calculations

## 🔒 Security Features

- **Authentication**: Supabase Auth with email verification
- **Authorization**: Row Level Security (RLS) on all data
- **API Security**: Rate limiting and CORS protection
- **Input Validation**: Zod validation on frontend, Joi on backend
- **Helmet**: Security headers and protection

## 🧪 Development

### Running Tests
```bash
npm test
```

### Code Quality
```bash
npm run lint
```

### API Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Get Sensex price
curl http://localhost:3001/api/dhanhq/sensex-price
```

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection**: Verify URL and keys in .env
2. **DhanHQ API**: Check token validity and rate limits
3. **WebSocket Issues**: Ensure CORS is properly configured
4. **Database Access**: Verify RLS policies are set up correctly

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📈 Performance Optimization

- **State Management**: Efficient Zustand stores
- **Bundle Size**: Tree shaking with Vite
- **Database**: Optimized queries with indexes
- **Caching**: Response caching for market data
- **Rate Limiting**: API protection and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting section

## 🎯 Roadmap

- [ ] Multi-strategy support
- [ ] Advanced charting
- [ ] Portfolio analytics
- [ ] Mobile app
- [ ] Paper trading mode
- [ ] Strategy backtesting
- [ ] Advanced order types
- [ ] Social trading features

---

**Disclaimer**: This is a demonstration platform. Always test thoroughly before using with real funds. Trading involves risk and may not be suitable for all investors.