import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Navbar from '@/page/(Admin)/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type LayoutAdminProps = {
  children: React.ReactNode;
};

const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  const {user} = useAuth();

  const navigate = useNavigate();

  if (!user) {
    return navigate('/auth/login');
  }
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Navbar />
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default LayoutAdmin;
