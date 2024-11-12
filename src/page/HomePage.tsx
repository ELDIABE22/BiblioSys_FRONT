import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <section className="flex flex-col gap-5 justify-center items-center h-screen bg-primary">
      <h1 className="text-7xl font-bold tracking-widest uppercase">
        BiblioSys
      </h1>
      <Link to={'/auth/login'}>
        <Button variant={'outline'}>Iniciar Sesión</Button>
      </Link>
    </section>
  );
};

export default HomePage;
