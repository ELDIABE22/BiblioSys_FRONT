import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Navbar from '@/page/(Admin)/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import axiosInstance from '@/lib/axios';
import { ILoansOverdueData } from '@/page/(Admin)/components/Navbar/navbar.type';
import axios from 'axios';
import toast from 'react-hot-toast';

type LayoutAdminProps = {
  children: React.ReactNode;
};

const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const fetchLoansOverdue = async (): Promise<
    ILoansOverdueData[] | undefined
  > => {
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/library/loan/overdue`
      );

      const currentLoansOverdue: ILoansOverdueData[] = JSON.parse(
        localStorage.getItem('loansOverdue') || '[]'
      );

      const loansMap = new Map<number, ILoansOverdueData>(
        currentLoansOverdue.map((loan) => [loan.idEstudiante, loan])
      );

      const loansOverdueWithVisto: ILoansOverdueData[] = res.data.map(
        (loan: ILoansOverdueData) => {
          const existingLoan = loansMap.get(loan.idEstudiante);
          return { ...loan, visto: existingLoan ? existingLoan.visto : false };
        }
      );

      localStorage.setItem(
        'loansOverdue',
        JSON.stringify(loansOverdueWithVisto)
      );

      return loansOverdueWithVisto;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status !== undefined &&
          error.response?.status >= 400 &&
          error.response?.status <= 499
        ) {
          toast.error(
            error.response?.data.mensaje ||
              error.response?.data.message ||
              'Error interno, intenta más tarde!',
            {
              iconTheme: {
                primary: '#1b4dff',
                secondary: '#fff',
              },
            }
          );
        } else {
          toast.error('Error interno, intenta más tarde!', {
            iconTheme: {
              primary: '#1b4dff',
              secondary: '#fff',
            },
          });
        }
      } else {
        toast.error('Error interno, intenta más tarde!', {
          iconTheme: {
            primary: '#1b4dff',
            secondary: '#fff',
          },
        });
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      return navigate('/auth/login');
    }
  }, [isAuthenticated, navigate, loading]);

  useEffect(() => {
    fetchLoansOverdue();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Navbar fetchLoansOverdue={fetchLoansOverdue} />
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default LayoutAdmin;
