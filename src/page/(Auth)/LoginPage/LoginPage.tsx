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
import { formLoginSchema } from '@/lib/zod';
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

const LoginPage = () => {
  const { signin, formLoading } = useAuth();

  const form = useForm<z.infer<typeof formLoginSchema>>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      usuario: '',
      contraseña: '',
    },
  });

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
              <span
                className={`text-sm hover:underline cursor-pointer text-primary`}
              >
                ¿Olvidaste tu contraseña?
              </span>

              <Button
                type="submit"
                variant="default"
                disabled={formLoading}
                className={`${
                  formLoading ? 'opacity-70 cursor-not-allowed' : ''
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
