import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, roleAPI } from '../../services/api';
import { Plus, Edit, Trash2, Shield, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import UserForm from './UserForm';
import RoleAssignment from './RoleAssignment';
import CompanyAssignment from '../../components/CompanyAssignment';

const Users = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);
  const [showCompanyAssignment, setShowCompanyAssignment] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userAPI.delete(id);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingUser) {
        const response = await userAPI.update(editingUser.id, data);
        if (data.password) {
          toast.success(
            `User updated! New password: ${data.password}`,
            { duration: 10000 }
          );
        } else {
          toast.success('User updated successfully');
        }
      } else {
        const response = await userAPI.create(data);
        if (response.data.password) {
          toast.success(
            `User created! Username: ${response.data.username}, Password: ${response.data.password}`,
            { duration: 15000 }
          );
        } else {
          toast.success('User created successfully');
        }
      }
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {hasPermission('CREATE_USER') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-600">Company: {user.company?.name || 'Not assigned'}</p>
                  {user.current_password && (
                    <p className="text-sm text-blue-600 font-mono">Password: {user.current_password}</p>
                  )}
                  <div className="mt-1">
                    {user.roles?.map((role) => (
                      <span
                        key={role.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {currentUser?.is_superuser && (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowCompanyAssignment(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                      title="Assign Company"
                    >
                      <Building2 className="h-4 w-4" />
                    </button>
                  )}
                  {hasPermission('ASSIGN_ROLES') && (
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowRoleAssignment(true);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                      title="Assign Roles"
                    >
                      <Shield className="h-4 w-4" />
                    </button>
                  )}
                  {hasPermission('UPDATE_USER') && (
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {hasPermission('DELETE_USER') && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete User"
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
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}

      {showCompanyAssignment && (
        <CompanyAssignment
          user={selectedUser}
          onClose={() => {
            setShowCompanyAssignment(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            fetchUsers();
          }}
        />
      )}

      {showRoleAssignment && (
        <RoleAssignment
          user={selectedUser}
          onClose={() => {
            setShowRoleAssignment(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default Users;