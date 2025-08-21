# ERP User Role Management Frontend

A comprehensive React dashboard for managing users, companies, roles, and permissions with real-time updates.

## Features

- **Authentication**: JWT-based login/logout system
- **User Management**: Create, edit, delete users with role assignment
- **Company Management**: Manage companies (tenants) with permission-based access
- **Role & Permission Management**: Create roles and assign granular permissions
- **Audit Logs**: View and filter system activity logs
- **Real-time Updates**: WebSocket integration for live permission updates
- **Permission-based UI**: Dynamic UI rendering based on user permissions
- **Route Protection**: Client-side route guarding based on authentication and permissions

## Tech Stack

- **React 18** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Axios** for API calls
- **Socket.io Client** for real-time communication
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Endpoint**
   Update the API base URL in `src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── common/         # Reusable components (ProtectedRoute)
├── contexts/           # React contexts (AuthContext)
├── pages/              # Page components
│   ├── companies/      # Company management
│   ├── users/          # User management
│   ├── roles/          # Role management
│   └── audit/          # Audit logs
├── services/           # API services
└── hooks/              # Custom hooks
```

## Key Components

### Authentication Context
- Manages user authentication state
- Handles JWT token storage
- Provides permission checking utilities
- Integrates WebSocket for real-time updates

### Protected Routes
- Route-level authentication checks
- Permission-based access control
- Automatic redirects for unauthorized access

### Dynamic UI Rendering
- Components check user permissions before rendering
- Buttons and menu items show/hide based on permissions
- Real-time permission updates without page refresh

## API Integration

The frontend expects the following API endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user info
- `GET /api/companies` - List companies
- `GET /api/users` - List users
- `GET /api/roles` - List roles
- `GET /api/permissions` - List permissions
- `GET /api/audit-logs` - List audit logs

## WebSocket Events

- `permissionUpdate` - Receives real-time permission changes

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080
```

## Usage

1. **Login**: Use the login form with valid credentials
2. **Dashboard**: View system overview and your permissions
3. **Navigation**: Use the sidebar to access different modules
4. **Management**: Create, edit, and delete entities based on your permissions
5. **Real-time**: Permission changes are reflected immediately in the UI

## Permission System

The application uses granular permissions such as:
- `VIEW_COMPANIES`, `CREATE_COMPANY`, `UPDATE_COMPANY`, `DELETE_COMPANY`
- `VIEW_USERS`, `CREATE_USER`, `UPDATE_USER`, `DELETE_USER`
- `VIEW_ROLES`, `CREATE_ROLE`, `UPDATE_ROLE`, `DELETE_ROLE`
- `VIEW_PERMISSIONS`, `ASSIGN_PERMISSIONS`, `ASSIGN_ROLES`
- `VIEW_AUDIT_LOGS`

UI elements are dynamically shown/hidden based on these permissions.