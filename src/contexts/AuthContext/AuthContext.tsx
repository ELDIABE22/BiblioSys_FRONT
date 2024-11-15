import { createContext, useEffect, useState } from 'react';
import { IAuthContextValue, IAuthUser, Props } from './authContext.type';
import { formLoginSchema } from '@/lib/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<IAuthContextValue | null>(null);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const signin = async (values: z.infer<typeof formLoginSchema>) => {
    setFormLoading(true);

    toast.promise(
      axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, values),
      {
        loading: 'Validando credenciales...',
        success: (res) => {
          if (res.status === 200) {
            Cookies.set('token', res.data.data.token, {
              expires: 1,
              sameSite: 'Strict',
            });

            Cookies.set('userData', JSON.stringify(res.data.data.user), {
              expires: 1,
              sameSite: 'Strict',
            });

            setFormLoading(false);

            window.location.href = '/library/admin/dashboard';

            return res.data.message;
          }
        },
        error: (error) => {
          setFormLoading(false);
          if (axios.isAxiosError(error)) {
            if (
              error.response?.status !== undefined &&
              error.response?.status >= 400 &&
              error.response?.status <= 499
            ) {
              return (
                error.response?.data.mensaje ||
                error.response?.data.message ||
                'Error interno, intenta más tarde!'
              );
            }

            return 'Error interno, intenta más tarde!';
          } else {
            return 'Error interno, intenta más tarde!';
          }
        },
      },
      {
        iconTheme: {
          primary: '#1b4dff',
          secondary: '#fff',
        },
      }
    );
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('userData');

    window.location.href = '/auth/login';

    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = Cookies.get('token');
      const userData = Cookies.get('userData');

      if (!token || !userData) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setLoading(false);
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        formLoading,
        signin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
