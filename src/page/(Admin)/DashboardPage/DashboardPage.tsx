import {
  Book,
  ChartNoAxesColumn,
  ShoppingCart,
  UsersRound,
} from 'lucide-react';
import CardDashboardDetail from '@/page/(Admin)/DashboardPage/components/CardDashboardDetail/CardDashboardDetail';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IDetails } from './dashboardPage.type';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];
const chartConfig = {
  desktop: {
    label: 'Desktop', 
    color: '#1b4dff',
  },
} satisfies ChartConfig;

const DashboardPage = () => {
  const [details, setDetails] = useState<IDetails>();

  const detailsItem = [
    {
      title: 'Total Prestamos',
      total: details?.totalPrestamos,
      href: '/library/admin/loan',
      color: '#1b4dff',
      icon: ShoppingCart,
    },
    {
      title: 'Total Libros',
      total: details?.totalLibros,
      href: '/library/admin/book',
      color: '#F71735',
      icon: Book,
    },
    {
      title: 'Total Estudiantes',
      total: details?.totalEstudiantes,
      href: '/library/admin/student',
      color: '#00FF00',
      icon: ChartNoAxesColumn,
    },
    {
      title: 'Total Usuarios',
      total: details?.totalUsuarios,
      href: '/library/admin/user',
      color: '#FFA500',
      icon: UsersRound,
    },
  ];

  const fetchCountEntity = async () => {
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/library/dashboard`
      );
      setDetails(res.data);
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
    fetchCountEntity();
  }, []);

  return (
    <section className="mx-5 space-y-5">
      <Card className="px-5">
        <CardHeader className="items-center border-b-2 mb-10 pb-5">
          <h2 className="font-bold text-sm sm:text-xl">Panel Administrativo</h2>
          <p className="text-sm sm:text-base">
            Reportes gráficos del sistema de biblioteca
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {detailsItem.map((item, index) => (
          <CardDashboardDetail key={index} item={item} />
        ))}
      </div>

      <Card className="max-w-[600px]">
        <CardHeader className='border-b-2'>
          <CardTitle>Ultimos 7 dias de prestamos</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="desktop"
                type="natural"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
};

export default DashboardPage;
