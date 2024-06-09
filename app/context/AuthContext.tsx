import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedExpiration = localStorage.getItem('authExpiration');
    if (storedToken && storedExpiration) {
      const expirationDate = new Date(storedExpiration);
      if (expirationDate > new Date()) {
        setIsAuthenticated(true);
        setToken(storedToken);
      } else {
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const expirationDate = new Date(new Date().getTime() + 30 * 60 * 1000);
      localStorage.setItem('authExpiration', expirationDate.toISOString());
    }
  }, [isAuthenticated]);

  const login = (authToken: string) => {
    setIsAuthenticated(true);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    const expirationDate = new Date(new Date().getTime() + 30 * 60 * 1000);
    localStorage.setItem('authExpiration', expirationDate.toISOString());
    router.push('/');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authExpiration');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
