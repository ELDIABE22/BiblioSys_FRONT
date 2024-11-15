import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="flex flex-col gap-5 justify-center items-center h-screen bg-primary">
      <h1 className="text-5xl sm:text-7xl font-bold tracking-widest uppercase">
        BiblioSys
      </h1>
      {isAuthenticated ? (
        <Link to={'/library/admin/dashboard'}>
          <Button variant={'outline'} className='uppercase'>Admin</Button>
        </Link>
      ) : (
        <Link to={'/auth/login'}>
          <Button variant={'outline'} className='uppercase'>Iniciar Sesión</Button>
        </Link>
      )}
    </section>
  );
};

export default HomePage;
