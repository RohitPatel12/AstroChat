import { createContext, useContext, useEffect, useState } from 'react';

// 1. Create an AuthContext to store user login data
const AuthContext = createContext();

// 2. Custom hook to access the AuthContext from any component
export const useAuth = () => useContext(AuthContext);

// 3. The main provider that wraps the whole app in `main.jsx`
export const AuthProvider = ({ children }) => {
  // 4. auth state holds the current user and token
  const [auth, setAuth] = useState(() => {
    // Try to get saved login state from localStorage
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  });

  // 5. Whenever auth changes, update localStorage
  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  // 6. Login function to be used after successful login/signup
  const login = (userData) => setAuth(userData);

  // 7. Logout function to clear session
  const logout = () => setAuth(null);

  // 8. Provide the auth data + login/logout functions to all children
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
