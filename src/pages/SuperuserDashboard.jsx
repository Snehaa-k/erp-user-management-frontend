import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { companyAPI, userAPI, roleAPI, auditAPI } from '../services/api';
import { Building2, Users, Shield, FileText, Settings, UserPlus, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const SuperuserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    roles: 0,
    auditLogs: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.is_superuser) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [companiesRes, usersRes, rolesRes, auditRes] = await Promise.all([
        companyAPI.getAll(),
        userAPI.getAll(),
        roleAPI.getAll(),
        auditAPI.getAll()
      ]);

      setStats({
        companies: companiesRes.data.length,
        users: usersRes.data.length,
        roles: rolesRes.data.length,
        auditLogs: auditRes.data.length
      });

      // Get recent audit logs for activity
      setRecentActivity(auditRes.data.slice(0, 10));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_superuser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">This dashboard is only accessible to system administrators.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  const dashboardCards = [
    {
      title: 'Total Companies',
      value: stats.companies,
      icon: Building2,
      color: 'bg-blue-500',
      description: 'Active tenants in the system'
    },
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'bg-green-500',
      description: 'Users across all companies'
    },
    {
      title: 'Total Roles',
      value: stats.roles,
      icon: Shield,
      color: 'bg-purple-500',
      description: 'Roles across all companies'
    },
    {
      title: 'Audit Logs',
      value: stats.auditLogs,
      icon: FileText,
      color: 'bg-orange-500',
      description: 'System activity records'
    }
  ];

  const quickActions = [
    {
      title: 'Create Company',
      description: 'Add new company to system',
      icon: Building,
      link: '/companies',
      color: 'bg-blue-600'
    },
    {
      title: 'Create User',
      description: 'Add new user to system',
      icon: UserPlus,
      link: '/users',
      color: 'bg-green-600'
    },
    {
      title: 'Manage Roles',
      description: 'Create and assign roles',
      icon: Shield,
      link: '/roles',
      color: 'bg-purple-600'
    },
    {
      title: 'User Management',
      description: 'Assign companies and roles to users',
      icon: Users,
      link: '/users',
      color: 'bg-indigo-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Administrator Dashboard</h1>
            <p className="text-blue-100">Welcome back, {user.username}! You have full system access.</p>
          </div>
          <div className="text-6xl opacity-20">
            🔑
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className={`${card.color} rounded-lg p-3`}>
                <card.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.link}
              className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className={`${action.color} rounded-lg p-2`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>


    </div>
  );
};

export default SuperuserDashboard;