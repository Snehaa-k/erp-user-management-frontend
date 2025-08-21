import { useState, useEffect } from 'react';
import { permissionAPI, roleAPI } from '../../services/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const PermissionAssignment = ({ role, onClose }) => {
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await permissionAPI.getAll();
      setPermissions(response.data);
      setRolePermissions(role.permissions || []);
    } catch (error) {
      toast.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionName) => {
    if (rolePermissions.includes(permissionName)) {
      setRolePermissions(rolePermissions.filter(p => p !== permissionName));
    } else {
      setRolePermissions([...rolePermissions, permissionName]);
    }
  };

  const handleSave = async () => {
    try {
      await roleAPI.assignPermissions(role.id, rolePermissions);
      toast.success('Permissions updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update permissions');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Assign Permissions to {role.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center">
              <input
                type="checkbox"
                id={`permission-${permission.id}`}
                checked={rolePermissions.includes(permission.name)}
                onChange={() => handlePermissionToggle(permission.name)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`permission-${permission.id}`} className="ml-2 block text-sm text-gray-900">
                {permission.name}
                {permission.description && (
                  <span className="block text-xs text-gray-500">{permission.description}</span>
                )}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionAssignment;