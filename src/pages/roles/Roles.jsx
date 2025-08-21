import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { roleAPI } from '../../services/api';
import { Plus, Edit, Trash2, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import RoleForm from './RoleForm';
import PermissionAssignment from './PermissionAssignment';

const Roles = () => {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showPermissionAssignment, setShowPermissionAssignment] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await roleAPI.getAll();
      setRoles(response.data);
    } catch (error) {
      toast.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    
    try {
      await roleAPI.delete(id);
      setRoles(roles.filter(r => r.id !== id));
      toast.success('Role deleted successfully');
    } catch (error) {
      toast.error('Failed to delete role');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingRole) {
        await roleAPI.update(editingRole.id, data);
        toast.success('Role updated successfully');
      } else {
        await roleAPI.create(data);
        toast.success('Role created successfully');
      }
      setShowForm(false);
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      toast.error('Failed to save role');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
        {hasPermission('CREATE_ROLE') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Role</span>
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {roles.map((role) => (
            <li key={role.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                  <div className="mt-1">
                    {role.permissions?.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {hasPermission('ASSIGN_PERMISSIONS') && (
                    <button
                      onClick={() => {
                        setSelectedRole(role);
                        setShowPermissionAssignment(true);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <Key className="h-4 w-4" />
                    </button>
                  )}
                  {hasPermission('UPDATE_ROLE') && (
                    <button
                      onClick={() => {
                        setEditingRole(role);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {hasPermission('DELETE_ROLE') && (
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <RoleForm
          role={editingRole}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingRole(null);
          }}
        />
      )}

      {showPermissionAssignment && (
        <PermissionAssignment
          role={selectedRole}
          onClose={() => {
            setShowPermissionAssignment(false);
            setSelectedRole(null);
            fetchRoles();
          }}
        />
      )}
    </div>
  );
};

export default Roles;