import { useState, useEffect } from 'react';
import { companyAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const CompanySelector = ({ register, errors, defaultValue = null }) => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.is_superuser) {
      fetchCompanies();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAll();
      setCompanies(response.data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show for superusers
  if (!user?.is_superuser) {
    return null;
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading companies...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Company</label>
      <select
        {...register('company')}
        defaultValue={defaultValue}
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Auto-create default company if needed</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Leave empty to auto-create a default company if none exists
      </p>
    </div>
  );
};

export default CompanySelector;