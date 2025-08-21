import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { companyAPI } from '../../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CompanyForm from './CompanyForm';

const Companies = () => {
  const { hasPermission } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAll();
      setCompanies(response.data);
    } catch (error) {
      toast.error('Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    
    try {
      await companyAPI.delete(id);
      setCompanies(companies.filter(c => c.id !== id));
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingCompany) {
        await companyAPI.update(editingCompany.id, data);
        toast.success('Company updated successfully');
      } else {
        await companyAPI.create(data);
        toast.success('Company created successfully');
      }
      setShowForm(false);
      setEditingCompany(null);
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to save company');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        {hasPermission('CREATE_COMPANY') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Company</span>
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {companies.map((company) => (
            <li key={company.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-500">{company.description}</p>
                </div>
                <div className="flex space-x-2">
                  {hasPermission('UPDATE_COMPANY') && (
                    <button
                      onClick={() => {
                        setEditingCompany(company);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {hasPermission('DELETE_COMPANY') && (
                    <button
                      onClick={() => handleDelete(company.id)}
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
        <CompanyForm
          company={editingCompany}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCompany(null);
          }}
        />
      )}
    </div>
  );
};

export default Companies;