# QuikApp Frontend - Trip Management & Vendor Payment System

A comprehensive React-based frontend application for managing trips, vendor payments, and logistics operations.

## 🚀 Features

### 1. Trip Management

- **Full Trip Lifecycle**: Scheduled → Ongoing → Completed/Cancelled/Delayed
- **Route Management**: From/to locations, distance, duration tracking
- **Vehicle & Driver Assignment**: Complete assignment details
- **Trip Documentation**: Internal notes and special instructions
- **Status Management**: Real-time status updates with visual indicators
- **Payment Tracking**: Integrated payment history and outstanding amounts

### 2. Vendor Payment Management

- **Payment Types**: Advance, Partial, and Final payments
- **Payment Modes**: Bank Transfer, UPI, Cash, Cheque, NEFT, RTGS, IMPS
- **UTR Tracking**: Complete transaction tracking with reconciliation
- **Automatic Calculations**: Outstanding amounts and completion percentages
- **Payment History**: Chronological audit trail with detailed records
- **Receipt Management**: Document upload and storage

### 3. Vendor Bank Details

- **Multiple Accounts**: Support for multiple bank accounts per vendor
- **Primary Account Management**: Mark and manage default payment accounts
- **Secure Storage**: Encrypted storage of sensitive banking information
- **Complete Account Info**: Holder, Number, IFSC, Bank, Branch, Type
- **Account Types**: Savings, Current, and Business accounts

### 4. Analytics & Reporting

- **Payment Overview**: Payable vs Paid analysis
- **Vendor-wise Reports**: Outstanding balances and payment summaries
- **Trip Financials**: Complete financial tracking per trip
- **Trend Analysis**: Payment and trip trends over time
- **Export Functionality**: PDF, Excel, and CSV export options
- **Real-time Dashboards**: Live analytics with visual indicators

### 5. Search & Filtering

- **Multi-field Search**: Fuzzy search across all relevant fields
- **Advanced Filters**: Status, date range, vendor, client filters
- **Pagination**: Optimized performance with server-side pagination
- **Real-time Results**: Instant search results with debouncing

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **State Management**: React Hooks with Context API
- **HTTP Client**: Axios with interceptors
- **Date Handling**: Day.js
- **Routing**: React Router v6
- **Notifications**: React-toastify
- **Styling**: SCSS modules with Tailwind CSS

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── routes/             # Page components and routing
│   ├── Trips/         # Trip management pages
│   ├── AccountsPayable/ # Payment management
│   ├── Vendor/        # Vendor management
│   └── Reports/       # Analytics and reporting
├── services/          # API services and utilities
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── layouts/          # Layout components
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_BACKEND=http://localhost:8000/api
```

## 📊 API Endpoints

### Trip Management

- `GET /api/trips` - List trips with filters & pagination
- `GET /api/trips/{id}` - Get trip details
- `POST /api/trips` - Create trip
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Cancel/Delete trip
- `PATCH /api/trips/{id}/status` - Update trip status

### Payment Management

- `GET /api/payments` - List all payments
- `GET /api/payments/{id}` - Get payment details
- `POST /api/payments` - Log new payment
- `PUT /api/payments/{id}` - Update payment entry
- `DELETE /api/payments/{id}` - Delete payment
- `GET /api/payments/trip/{tripId}` - Payments for a specific trip
- `GET /api/payments/vendor/{vendorId}` - Payments for a vendor

### Vendor Bank Details

- `GET /api/vendors/{id}/banks` - List vendor bank accounts
- `POST /api/vendors/{id}/banks` - Add bank account
- `PUT /api/vendors/{id}/banks/{bankId}` - Update account
- `DELETE /api/vendors/{id}/banks/{bankId}` - Remove account
- `PATCH /api/vendors/{id}/banks/{bankId}/primary` - Set primary account

### Analytics & Reporting

- `GET /api/analytics/payments` - Payment overview
- `GET /api/analytics/vendors` - Vendor payment summary
- `GET /api/analytics/trips` - Trip financial summary
- `GET /api/analytics/outstanding` - Outstanding balances
- `GET /api/analytics/trends` - Payment/Trip trends
- `GET /api/reports/export` - Export data (PDF/Excel/CSV)

### Search & Filtering

- `GET /api/search/trips` - Search trips with filters
- `GET /api/search/payments` - Search payments with filters
- `GET /api/search/vendors` - Search vendors

## 🎯 Key Features in Detail

### Trip Management

- **Status Tracking**: Visual status indicators with color coding
- **Financial Integration**: Real-time payment tracking and outstanding calculations
- **Document Management**: Upload and manage trip-related documents
- **Assignment Details**: Complete vehicle and driver assignment tracking
- **Route Information**: Detailed from/to location management

### Payment Management

- **Multi-mode Support**: All major Indian payment modes
- **UTR Reconciliation**: Track and verify payment transactions
- **Automatic Calculations**: Real-time outstanding and completion percentages
- **Payment History**: Complete audit trail with timestamps
- **Receipt Management**: Secure document storage and retrieval

### Vendor Management

- **Bank Account Management**: Multiple accounts with primary designation
- **Secure Storage**: Encrypted sensitive information
- **Account Types**: Support for all major account types
- **Primary Account**: Default payment account management

### Analytics Dashboard

- **Real-time Metrics**: Live payment and trip statistics
- **Visual Indicators**: Progress bars and completion percentages
- **Trend Analysis**: Historical data visualization
- **Export Options**: Multiple format support for reports
- **Filtered Views**: Date range and vendor-specific analytics

## 🔧 Development

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Material-UI design system

### Component Structure

- Functional components with hooks
- TypeScript interfaces for props
- SCSS modules for styling
- Responsive design patterns

### State Management

- React Context for global state
- Local state with useState
- Custom hooks for reusable logic
- API integration with Axios

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Adaptive layouts

## 🔒 Security Features

- JWT token authentication
- Secure API communication
- Input validation and sanitization
- Error handling and logging

## 🚀 Deployment

- Build optimization
- Environment configuration
- Docker support
- CI/CD ready

## 📈 Performance

- Lazy loading for routes
- Optimized bundle size
- Efficient re-rendering
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
