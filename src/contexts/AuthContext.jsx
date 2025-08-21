import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        permissions: action.payload.permissions,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        permissions: [],
        isAuthenticated: false,
        loading: false,
      };
    case 'UPDATE_PERMISSIONS':
      return {
        ...state,
        permissions: action.payload,
        user: state.user ? { ...state.user, permissions: action.payload } : null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    permissions: [],
    isAuthenticated: false,
    loading: true,
    socket: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      authAPI.getCurrentUser()
        .then(response => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.user,
              permissions: response.data.permissions,
            },
          });
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          dispatch({ type: 'SET_LOADING', payload: false });
        });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }

    return () => {
      if (state.socket) {
        state.socket.disconnect();
      }
    };
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { access, refresh, user, permissions } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, permissions },
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const hasPermission = (permission) => {
    // Superusers have all permissions
    if (state.user?.is_superuser) {
      return true;
    }
    return state.permissions.includes(permission);
  };

  const updateUserPermissions = (newPermissions) => {
    dispatch({
      type: 'UPDATE_PERMISSIONS',
      payload: newPermissions,
    });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      hasPermission,
      updateUserPermissions,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};