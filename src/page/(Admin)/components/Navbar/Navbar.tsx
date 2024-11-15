import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { BellRing, Eye, Gauge } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DialogMessage from './components/DialogMessage/DialogMessage';
import { ILoansOverdueData, NavbarProps } from './navbar.type';
import React, { useEffect, useState } from 'react';

const Navbar: React.FC<NavbarProps> = ({ fetchLoansOverdue }) => {
  const [data, setData] = useState<ILoansOverdueData[] | []>([]);

  const { user } = useAuth();

  const location = useLocation();
  const currentPath = location.pathname?.split('/').pop();
  const capitalizedPath = currentPath
    ? currentPath.charAt(0).toUpperCase() + currentPath.slice(1)
    : '';

  const unseenData = data.filter((item) => item.visto === false);

  const markAllAsSeen = () => {
    const updatedData = data.map((item) => ({ ...item, visto: true }));
    setData(updatedData);
    localStorage.setItem('loansOverdue', JSON.stringify(updatedData));
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchLoansOverdue();
      if (fetchedData) {
        setData(fetchedData);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative hover:bg-white/40 p-1 rounded-full cursor-pointer">
              <BellRing size={20} color="#FFFF" />
              {unseenData.length > 0 && (
                <span className="absolute -top-1 right-0 bg-[#f71735] text-white rounded-full text-xs h-4 w-4 flex items-center justify-center">
                  {unseenData.length}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[370px] max-h-[423px] p-0 overflow-auto">
            <div className="flex justify-between items-center p-2 border-b border-primary shadow-md">
              <h2 className="text-sm font-bold">Notificaciones</h2>
              <Button
                variant="outline"
                size="icon"
                onClick={markAllAsSeen}
                disabled={unseenData.length <= 0 || !user}
              >
                <Eye />
              </Button>
            </div>

            {/* Notificaciones */}
            {unseenData.length > 0 ? (
              unseenData.map((item) => (
                <DialogMessage
                  key={item.idEstudiante}
                  data={item}
                  fetchLoansOverdue={fetchLoansOverdue}
                  setData={setData}
                />
              ))
            ) : (
              <p className="font-bold text-center p-5">
                No hay notificaciones.
              </p>
            )}
          </PopoverContent>
        </Popover>

        <Separator
          orientation="vertical"
          className="hidden mx-4 text-white/20 sm:block"
        />

        <div className="hidden gap-3 items-center sm:flex">
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
            <span className="text-gray-300 text-xs">{user?.rol}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
