import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { BellRing, Gauge } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();

  const location = useLocation();
  const currentPath = location.pathname?.split('/').pop();
  const capitalizedPath = currentPath
    ? currentPath.charAt(0).toUpperCase() + currentPath.slice(1)
    : '';

  return (
    <nav className="flex items-center px-5 justify-between h-16 w-full bg-primary">
      <Breadcrumb>
        <BreadcrumbList className="text-white">
          <BreadcrumbItem>
            <BreadcrumbLink href="/library/admin/dashboard">
              <Gauge size={20} color="#FFFF" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">
              {capitalizedPath}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex h-full items-center">
        <div className="hover:bg-white/40 p-1 rounded-full cursor-pointer">
          <BellRing size={20} color="#FFFF" />
        </div>

        <Separator orientation="vertical" className="mx-4 text-white/20" />

        <div className="flex gap-3 items-center">
          <Avatar className="bg-white">
            <AvatarImage src="/foto-perfil.png" alt="perfil" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white text-sm">
              {`${user?.nombres.split(' ')[0]} ${
                user?.apellidos.split(' ')[0]
              }`}
            </p>
            <span className="text-gray-300 text-xs">{user?.correo}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
