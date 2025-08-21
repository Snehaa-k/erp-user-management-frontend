import { useAuth } from '../contexts/AuthContext';
import { Building2, Users, Shield, FileText } from 'lucide-react';
import SuperuserDashboard from './SuperuserDashboard';

const Dashboard = () => {
  const { user, hasPermission, permissions } = useAuth();

  // Redirect superusers to their specialized dashboard
  if (user?.is_superuser) {
    return <SuperuserDashboard />;
  }

  const stats = [
    { 
      name: 'Users', 
      icon: Users, 
      color: 'bg-green-500',
      permission: 'VIEW_USERS'
    },
    { 
      name: 'Roles', 
      icon: Shield, 
      color: 'bg-purple-500',
      permission: 'VIEW_ROLES'
    },
    { 
      name: 'Audit Logs', 
      icon: FileText, 
      color: 'bg-orange-500',
      permission: 'VIEW_AUDIT_LOGS'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
        <p className="text-gray-600">Here's what's happening in your company today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          if (!hasPermission(stat.permission)) return null;
          
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Manage {stat.name.toLowerCase()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Permissions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {permissions && permissions.length > 0 ? (
            permissions.map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {permission}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No permissions assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;