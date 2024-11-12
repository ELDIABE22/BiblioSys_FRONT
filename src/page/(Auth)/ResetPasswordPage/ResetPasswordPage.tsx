import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formResetPassword } from '@/lib/zod';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ResetPasswordForm: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formResetPassword>>({
    resolver: zodResolver(formResetPassword),
    defaultValues: {
      contraseña: '',
      confirmContraseña: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formResetPassword>) => {
    setFormLoading(true);

    if (values.contraseña !== values.confirmContraseña) {
      setFormLoading(false);

      return toast.error('Las contraseñas no coinciden', {
        iconTheme: {
          primary: '#1b4dff',
          secondary: '#fff',
        },
      });
    }

    toast.promise(
      axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          email,
          password: values.contraseña
        }
      ),
      {
        loading: 'Guardando...',
        success: (res) => {
          if (res.status === 200) {
            navigate('/library/admin/dashboard')
            
            form.reset();

            setFormLoading(false);

            return res.data.message;
          }
        },
        error: (error) => {
          console.log(error);
          setFormLoading(false);
          if (axios.isAxiosError(error)) {
            if (
              error.response?.status !== undefined &&
              error.response?.status >= 400 &&
              error.response?.status <= 499
            ) {
              return (
                error.response?.data.mensaje ||
                error.response?.data.message ||
                'Error interno, intenta más tarde!'
              );
            }

            return 'Error interno, intenta más tarde!';
          } else {
            return 'Error interno, intenta más tarde!';
          }
        },
      },
      {
        iconTheme: {
          primary: '#1b4dff',
          secondary: '#fff',
        },
      }
    );

  };

  return (
    <section className={`min-h-screen flex items-center justify-center bg-primary`}>
      <Card
        className={`w-full max-w-md px-8 border-none bg-white rounded-xl shadow-2xl`}
      >
        <CardHeader>
          <CardTitle className="uppercase text-3xl font-bold tracking-widest text-center text-primary">
            Restablecer Contraseña
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="contraseña"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`uppercase text-primary`}>
                      Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="*******"
                        type="password"
                        disabled={formLoading}
                        className={`bg-gray-50 border-primary`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmContraseña"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`uppercase text-primary`}>
                      Confirmar Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="*******"
                        disabled={formLoading}
                        className={`bg-gray-50 border-primary`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                variant="default"
                disabled={formLoading}
                className={`${formLoading ? 'opacity-70 cursor-not-allowed' : ''
                  } w-full`}
              >
                {formLoading && <Loader2 className="animate-spin" />}

                {formLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default ResetPasswordForm;
