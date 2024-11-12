import React, { useEffect, useState } from 'react';
import { DialogUserProps } from './dialogUser.type';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formUserSchema } from '@/lib/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { cn } from '@/lib/utils';

const DialogUser: React.FC<DialogUserProps> = ({
  fetchUsers,
  method,
  dataToUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const form = useForm<z.infer<typeof formUserSchema>>({
    resolver: zodResolver(formUserSchema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      usuario: '',
      correo: '',
      rol: '',
      estado: '',
    },
  });

  const state = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' },
  ] as const;

  const rol = [
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Asistente', value: 'Asistente' },
  ] as const;

  const onSubmit = async (values: z.infer<typeof formUserSchema>) => {
    setFormLoading(true);

    if (method === 'POST') {
      toast.promise(
        axiosInstance.post(
          `${import.meta.env.VITE_API_URL}/library/user/new`,
          values
        ),
        {
          loading: 'Guardando...',
          success: (res) => {
            if (res.status === 201) {
              fetchUsers();

              form.reset();

              setOpen(false);
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
    } else {
      const data = {
        id: dataToUpdate?.id,
        ...values,
      };

      toast.promise(
        axiosInstance.put(
          `${import.meta.env.VITE_API_URL}/library/user/update`,
          data
        ),
        {
          loading: 'Actualizando...',
          success: (res) => {
            if (res.status === 200) {
              fetchUsers();

              setOpen(false);

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
    }
  };

  useEffect(() => {
    if (method === 'PUT' && dataToUpdate) {
      form.setValue('nombres', dataToUpdate.nombres);
      form.setValue('apellidos', dataToUpdate.apellidos);
      form.setValue('usuario', dataToUpdate.usuario);
      form.setValue('correo', dataToUpdate.correo);
      form.setValue('rol', dataToUpdate.rol);
      form.setValue('estado', dataToUpdate.estado);
    }
  }, [dataToUpdate, form, method]);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen && method === 'POST') {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          {method === 'POST' ? (
            <>
              <Plus />
              Nuevo
            </>
          ) : (
            'Editar'
          )}
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {method === 'POST' ? 'Crear Usuario' : 'Editar Usuario'}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {method === 'POST'
                ? 'Por favor, complete los siguientes campos para crear un nuevo usuario.'
                : 'Por favor, revise y edita los campos deseados del usuario.'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="nombres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`uppercase text-primary`}>
                    Nombres
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={formLoading}
                      placeholder="Ingrese los nombres"
                      className={`bg-gray-50 border-primary`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`uppercase text-primary`}>
                    Apellidos
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={formLoading}
                      placeholder="Ingrese los apellidos"
                      className={`bg-gray-50 border-primary`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      disabled={formLoading}
                      placeholder="Ingrese el nombre de usuario"
                      className={`bg-gray-50 border-primary`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="correo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`uppercase text-primary`}>
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={formLoading}
                      placeholder="Ingrese el correo"
                      className={`bg-gray-50 border-primary`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {method === 'PUT' && (
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={`uppercase text-primary`}>
                      Estado
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'justify-between px-3 border-primary',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? state.find((item) => item.value === field.value)
                                  ?.label
                              : 'Seleccionar estado'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {state.map((item) => (
                                <CommandItem
                                  value={item.label}
                                  key={item.value}
                                  onSelect={() => {
                                    form.setValue('estado', item.value);
                                  }}
                                >
                                  {item.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      item.value === field.value
                                        ? 'opacity-100 text-primary'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={`uppercase text-primary`}>
                    Rol
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between px-3 border-primary',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? rol.find((item) => item.value === field.value)
                                ?.label
                            : 'Seleccionar rol'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {rol.map((item) => (
                              <CommandItem
                                value={item.label}
                                key={item.value}
                                onSelect={() => {
                                  form.setValue('rol', item.value);
                                }}
                              >
                                {item.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    item.value === field.value
                                      ? 'opacity-100 text-primary'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={formLoading} type="submit">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export default DialogUser;
