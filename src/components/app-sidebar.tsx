import {
  Book,
  ChevronRight,
  Gauge,
  Hourglass,
  Settings,
  UsersRound,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useLocation } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

// Menu items.
const items = [
  {
    title: 'Panel',
    url: '/library/admin/dashboard',
    icon: Gauge,
    subItem: [],
  },
  {
    title: 'Estudiantes',
    url: '/library/admin/student',
    icon: UsersRound,
    subItem: [],
  },
  {
    title: 'Libros',
    url: '#',
    icon: Book,
    subItem: [
      {
        title: 'Autores',
        url: '/library/admin/author',
        icon: ChevronRight,
      },
      {
        title: 'Materias',
        url: '/library/admin/subject',
        icon: ChevronRight,
      },
      {
        title: 'Libros',
        url: '/library/admin/book',
        icon: ChevronRight,
      },
    ],
  },
  {
    title: 'Prestamos',
    url: '/library/admin/loan',
    icon: Hourglass,
    subItem: [],
  },
  {
    title: 'Administración',
    url: '#',
    icon: Settings,
    subItem: [
      {
        title: 'Usuarios',
        url: '/library/admin/user',
        icon: ChevronRight,
      },
      {
        title: 'Configuración',
        url: '/library/admin/config',
        icon: ChevronRight,
      },
    ],
  },
];

export function AppSidebar() {
  const { logout, user } = useAuth();

  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="h-full">
          <SidebarGroupLabel className="uppercase font-bold text-primary text-xl tracking-widest mb-2">
            BiblioSys
          </SidebarGroupLabel>
          <Separator className="mb-5" />
          <SidebarGroupContent className="flex flex-col h-full justify-between">
            <SidebarMenu>
              {items
                .filter(
                  (item) =>
                    !(
                      user?.rol === 'Asistente' &&
                      item.title === 'Administración'
                    )
                )
                .map((item, index) =>
                  item.subItem.length > 0 ? (
                    <Collapsible
                      key={index}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`${
                              location.pathname === item.url &&
                              'bg-primary text-white hover:bg-primary hover:text-white active:bg-primary active:text-white'
                            } p-5 justify-between`}
                          >
                            <div className="flex items-center gap-2">
                              <item.icon size={16} />
                              <span className="uppercase tracking-widest">
                                {item.title}
                              </span>
                            </div>
                            <ChevronRight />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="border-l-primary">
                            {item.subItem.map((item, index) => (
                              <SidebarMenuSubItem key={index}>
                                <SidebarMenuButton asChild>
                                  <a
                                    href={item.url}
                                    className={`${
                                      location.pathname === item.url &&
                                      'bg-primary text-white hover:bg-primary hover:text-white active:bg-primary active:text-white'
                                    } p-5`}
                                  >
                                    <item.icon />
                                    <span className="uppercase tracking-widest">
                                      {item.title}
                                    </span>
                                  </a>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`${
                            location.pathname === item.url &&
                            'bg-primary text-white hover:bg-primary hover:text-white active:bg-primary active:text-white'
                          } p-5`}
                        >
                          <item.icon />
                          <span className="uppercase tracking-widest">
                            {item.title}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
            </SidebarMenu>
            <SidebarFooter>
              <Button
                variant={'destructive'}
                onClick={logout}
                className="uppercase"
              >
                Cerrar Sesión
              </Button>

              <div className="flex gap-3 items-center justify-center px-4 py-2 rounded-md bg-primary lg:hidden">
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
            </SidebarFooter>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
