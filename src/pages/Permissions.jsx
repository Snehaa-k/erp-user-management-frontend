import { useState, useEffect } from 'react';
import { permissionAPI } from '../services/api';
import { Key } from 'lucide-react';
import toast from 'react-hot-toast';

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await permissionAPI.getAll();
      setPermissions(response.data);
    } catch (error) {
      toast.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Permissions</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Permissions</h3>
          <p className="text-sm text-gray-500">
            These are all the permissions available in the system. They can be assigned to roles.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
              <Key className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <span className="text-sm font-medium text-gray-900">{permission.name}</span>
                {permission.description && (
                  <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Permissions;