import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { companyAPI, userAPI, roleAPI } from '../services/api';
import { Building2, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const TenantSetup = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [companyData, setCompanyData] = useState({ name: '', description: '' });
  const [adminData, setAdminData] = useState({ 
    username: '', 
    email: '', 
    first_name: '', 
    last_name: '', 
    password: '' 
  });
  const [createdCompany, setCreatedCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await companyAPI.create(companyData);
      setCreatedCompany(response.data);
      toast.success(`Company "${response.data.name}" created with Tenant Admin role!`);
      setStep(2);
    } catch (error) {
      toast.error('Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenantAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userData = { ...adminData, company: createdCompany.id };
      const userResponse = await userAPI.create(userData);
      
      const rolesResponse = await roleAPI.getAll();
      const tenantAdminRole = rolesResponse.data.find(
        role => role.name === 'Tenant Admin'
      );
      
      if (tenantAdminRole) {
        await userAPI.assignRole(userResponse.data.id, tenantAdminRole.id);
      }
      
      toast.success(`Tenant Admin created! Password: ${adminData.password}`, { duration: 10000 });
      setStep(3);
    } catch (error) {
      toast.error('Failed to create tenant admin');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_superuser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">Only system administrators can set up new tenants.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tenant Setup Wizard</h1>
          <p className="text-gray-600">Set up a new company and create their first admin user.</p>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
            <span className="ml-2 font-medium">Create Company</span>
          </div>
          <ArrowRight className="text-gray-400" />
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
            <span className="ml-2 font-medium">Create Admin</span>
          </div>
          <ArrowRight className="text-gray-400" />
          <div className={`flex items-center ${step >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>3</div>
            <span className="ml-2 font-medium">Complete</span>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div className="text-center mb-6">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">Create New Company</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                required
                value={companyData.name}
                onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={companyData.description}
                onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating Company...' : 'Create Company'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCreateTenantAdmin} className="space-y-4">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">Create Tenant Admin</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  required
                  value={adminData.first_name}
                  onChange={(e) => setAdminData({...adminData, first_name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  required
                  value={adminData.last_name}
                  onChange={(e) => setAdminData({...adminData, last_name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                required
                value={adminData.username}
                onChange={(e) => setAdminData({...adminData, username: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={adminData.email}
                onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="text"
                required
                value={adminData.password}
                onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating Admin...' : 'Create Tenant Admin'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Setup Complete!</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800 mb-2">Tenant Successfully Created</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Company:</strong> {createdCompany?.name}</p>
                <p><strong>Admin Username:</strong> {adminData.username}</p>
                <p><strong>Admin Password:</strong> {adminData.password}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setStep(1);
                setCompanyData({ name: '', description: '' });
                setAdminData({ username: '', email: '', first_name: '', last_name: '', password: '' });
                setCreatedCompany(null);
              }}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
            >
              Set Up Another Tenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantSetup;