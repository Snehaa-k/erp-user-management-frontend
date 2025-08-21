import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Building2, 
  Users, 
  Shield, 
  Key, 
  FileText, 
  Home,
  X,
  Settings
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { hasPermission, user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard', permission: null },
    { to: '/companies', icon: Building2, label: 'Companies', permission: 'VIEW_COMPANIES' },
    { to: '/users', icon: Users, label: 'Users', permission: 'VIEW_USERS' },
    { to: '/roles', icon: Shield, label: 'Roles', permission: 'VIEW_ROLES' },
    { to: '/permissions', icon: Key, label: 'Permissions', permission: 'VIEW_PERMISSIONS' },
    { to: '/audit-logs', icon: FileText, label: 'Audit Logs', permission: 'VIEW_AUDIT_LOGS' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 z-30 transform transition duration-200 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Mobile close button */}
        <div className="flex justify-between items-center px-4 md:justify-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8" />
            <span className="text-2xl font-extrabold">ERP System</span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            if (item.permission === 'superuser_only' && !user?.is_superuser) {
              return null;
            }
            if (item.permission && item.permission !== 'superuser_only' && !hasPermission(item.permission)) {
              return null;
            }
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
                    isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;