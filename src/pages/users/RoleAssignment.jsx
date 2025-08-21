import { useState, useEffect } from 'react';
import { roleAPI, userAPI } from '../../services/api';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const RoleAssignment = ({ user, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [originalRoles, setOriginalRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rolesResponse = await roleAPI.getAll();
      setRoles(rolesResponse.data);
      const userRoleIds = user.roles?.map(r => r.id) || [];
      setSelectedRoles(userRoleIds);
      setOriginalRoles(userRoleIds);
    } catch (error) {
      toast.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(id => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const rolesToAdd = selectedRoles.filter(id => !originalRoles.includes(id));
      const rolesToRemove = originalRoles.filter(id => !selectedRoles.includes(id));
      
      for (const roleId of rolesToAdd) {
        await userAPI.assignRole(user.id, roleId);
      }
      
      for (const roleId of rolesToRemove) {
        await userAPI.removeRole(user.id, roleId);
      }
      
      toast.success('Role assignments updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update role assignments');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Assign Roles to {user.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center">
              <input
                type="checkbox"
                id={`role-${role.id}`}
                checked={selectedRoles.includes(role.id)}
                onChange={() => handleRoleToggle(role.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`role-${role.id}`} className="ml-2 block text-sm text-gray-900">
                {role.name}
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
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignment;