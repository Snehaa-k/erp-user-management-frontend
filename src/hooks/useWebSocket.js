import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useWebSocket = () => {
  const { user, updateUserPermissions, permissions } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    setIsConnected(true);
    
    // Poll for permission changes every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await authAPI.getCurrentUser();
        const newPermissions = response.data.permissions;
        
        // Check if permissions changed
        if (JSON.stringify(permissions) !== JSON.stringify(newPermissions)) {
          updateUserPermissions(newPermissions);
          
          // Show notification
          toast.success('Your permissions have been updated!', {
            duration: 4000,
            icon: '🔄',
          });
        }
      } catch (error) {
        console.error('Failed to check permission updates:', error);
        setIsConnected(false);
      }
    }, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, [user, updateUserPermissions, permissions]);

  return { isConnected };
};