import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import WebSocketProvider from './components/common/WebSocketProvider';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import Companies from './pages/companies/Companies';
import Users from './pages/users/Users';
import Roles from './pages/roles/Roles';
import AuditLogs from './pages/audit/AuditLogs';
import Permissions from './pages/Permissions';
import TenantSetup from './pages/TenantSetup';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <div className="App">
            <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="companies"
                element={
                  <ProtectedRoute permission="VIEW_COMPANIES">
                    <Companies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <ProtectedRoute permission="VIEW_USERS">
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="roles"
                element={
                  <ProtectedRoute permission="VIEW_ROLES">
                    <Roles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="permissions"
                element={
                  <ProtectedRoute permission="VIEW_PERMISSIONS">
                    <Permissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ProtectedRoute permission="VIEW_AUDIT_LOGS">
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />
              <Route path="tenant-setup" element={<TenantSetup />} />
            </Route>
          </Routes>
          </div>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;