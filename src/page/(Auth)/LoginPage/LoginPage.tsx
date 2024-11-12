import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formCorreoSchema, formLoginSchema } from '@/lib/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { signin, formLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [formCorreoLoading, setFormCorreoLoading] = useState(false);

  const {user} = useAuth();

  const navigate = useNavigate();

  if (user) {
    return navigate('/library/admin/dashboard');
  }

  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      usuario: '',
      contraseña: '',
    },
  });

  const formCorreo = useForm<z.infer<typeof formCorreoSchema>>({
    resolver: zodResolver(formCorreoSchema),
    defaultValues: {
      correo: '',
    },
  });

  const onSubmitPassword = async (values: z.infer<typeof formCorreoSchema>) => {
    setFormCorreoLoading(true);

    toast.promise(
      axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/auth/link-reset-password`,
        values
      ),
      {
        loading: 'Guardando...',
        success: (res) => {
          if (res.status === 200) {
            setFormCorreoLoading(false);

            setOpen(false);
            
            form.reset();

            return res.data.message;
          }
        },
        error: (error) => {
          console.log(error);
          setFormCorreoLoading(false);
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
  }

  return (
    <section
      className={`min-h-screen flex items-center justify-center bg-primary`}
    >
      <Card
        className={`w-full max-w-md px-8 border-none bg-white rounded-xl shadow-2xl`}
      >
        <CardHeader
          className={`p-0 pt-8 flex gap-3 justify-center items-center flex-col text-gray-900`}
        >
          <CardTitle className="uppercase text-3xl font-bold tracking-widest text-center text-primary">
            Iniciar sesión
          </CardTitle>
          <div
            className={`border-2 h-36 w-36 overflow-hidden rounded-full border-primary`}
          >
            <img src="/login2.gif" alt="logo" className="h-36 w-36" />
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(signin)}>
            <CardContent className="space-y-5">
              <FormField
                control={form.control}
                name="usuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`uppercase text-primary`}>
                      Usuario
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ELDIABE22"
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
                name="contraseña"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`uppercase text-primary`}>
                      Contraseña
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="********"
                        disabled={formLoading}
                        className={`bg-gray-50 border-primary`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Dialog open={open}
                onOpenChange={(isOpen) => {
                  setOpen(isOpen);
                  if (isOpen) {
                    form.reset();
                  }
                }}>
                <DialogTrigger asChild>
                  <span
                    className={`text-sm hover:underline cursor-pointer text-primary`}
                  >
                    ¿Olvidaste tu contraseña?
                  </span>
                </DialogTrigger>
                <Form {...form}>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirmar Datos</DialogTitle>
                      <DialogDescription>
                        Ingresa el correo eléctronico para restablecer contraseña.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-3" onSubmit={formCorreo.handleSubmit(onSubmitPassword)}>
                      <FormField
                        control={formCorreo.control}
                        name="correo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`uppercase text-primary`}>
                              Correo Eléctronico
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={formCorreoLoading}
                                placeholder="Ingresa el correo eléctronico"
                                className={`bg-gray-50 border-primary`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button disabled={formCorreoLoading} type="submit">Confirmar</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Form>

              </Dialog>


              <Button
                type="submit"
                variant="default"
                disabled={formLoading}
                className={`${formLoading ? 'opacity-70 cursor-not-allowed' : ''
                  } w-full`}
              >
                {formLoading && <Loader2 className="animate-spin" />}

                {formLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default LoginPage;
