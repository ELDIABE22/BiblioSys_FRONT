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
import {
  IDetails,
  ILoanAmountPerDay,
  ILoanAmountPerMonth,
  ITop5MostLoanedBooks,
} from './dashboardPage.type';
import { Card, CardHeader } from '@/components/ui/card';
import CardLoanAmountPerDay from './components/CardLoanAmountPerDay/CardLoanAmountPerDay';
import CardLoanAmountPerMonth from './components/CardLoanAmountPerMonth/CardLoanAmountPerMonth';
import Top5MostLoanedBooks from './components/Top5MostLoanedBooks/Top5MostLoanedBooks';

const DashboardPage = () => {
  const [details, setDetails] = useState<IDetails>();
  const [loanAmountPerDay, setLoanAmountPerDay] = useState<
    ILoanAmountPerDay[] | []
  >([]);
  const [loanAmountPerMonth, setLoanAmountPerMonth] = useState<
    ILoanAmountPerMonth[] | []
  >([]);
  const [top5MostLoanedBooks, setTop5MostLoanedBooks] = useState<
    ITop5MostLoanedBooks[] | []
  >([]);

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

  const colors = [
    { color: '#1b4dff' },
    { color: '#F71735' },
    { color: '#00FF00' },
    { color: '#FFA500' },
    { color: '#FF1493' },
    { color: '#8A2BE2' },
    { color: '#FFD700' },
    { color: '#FF4500' },
    { color: '#32CD32' },
    { color: '#00CED1' },
    { color: '#FF6347' },
    { color: '#4682B4' },
  ];

  const getRandomColor = (usedColors: number[]) => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * colors.length);
    } while (usedColors.includes(randomIndex));
    usedColors.push(randomIndex);
    return colors[randomIndex].color;
  };

  const fetchCountEntity = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/library/dashboard`
      );
      let usedColors: number[] = [];
      setLoanAmountPerDay(
        data.cantidadPrestamosPorDia
          .sort(
            (a: ILoanAmountPerDay, b: ILoanAmountPerDay) =>
              new Date(b.dia).getTime() - new Date(a.dia).getTime()
          )
          .slice(0, 10)
          .map((item: ILoanAmountPerDay) => {
            return { ...item, fill: getRandomColor(usedColors) };
          })
      );
      usedColors = [];
      setLoanAmountPerMonth(
        data.cantidadPrestamosPorMes.map((item: ILoanAmountPerMonth) => {
          return { ...item, fill: getRandomColor(usedColors) };
        })
      );
      usedColors = [];
      setTop5MostLoanedBooks(
        data.top5LibrosMasPrestados.map((item: ITop5MostLoanedBooks) => {
          return { ...item, fill: getRandomColor(usedColors) };
        })
      );
      setDetails({
        totalEstudiantes: data.totalEstudiantes,
        totalLibros: data.totalLibros,
        totalPrestamos: data.totalPrestamos,
        totalUsuarios: data.totalUsuarios,
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mx-5 space-y-5 mb-5">
      <Card className="px-5">
        <CardHeader className="items-center border-b-2 border-primary mb-10 pb-5">
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

      <div className="flex flex-col lg:flex-row gap-5">
        <CardLoanAmountPerDay loanAmountPerDay={loanAmountPerDay} />
        <Top5MostLoanedBooks top5MostLoanedBooks={top5MostLoanedBooks} />
      </div>
      <CardLoanAmountPerMonth loanAmountPerMonth={loanAmountPerMonth} />
    </section>
  );
};

export default DashboardPage;
