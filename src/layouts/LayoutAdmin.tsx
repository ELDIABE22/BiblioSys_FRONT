import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import Navbar from '@/page/(Admin)/components/Navbar/Navbar';

type LayoutAdminProps = {
  children: React.ReactNode;
};

const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
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
