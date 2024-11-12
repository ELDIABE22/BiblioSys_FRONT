import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import axiosInstance from '@/lib/axios';
import { formAuthorSubjectSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { DialogAuthorSubjectwProps } from './dialogAuthorSubject.type';

const DialogAuthorSubject: React.FC<DialogAuthorSubjectwProps> = ({
  method,
  fetchEntity,
  entity,
  dataToUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const form = useForm<z.infer<typeof formAuthorSubjectSchema>>({
    resolver: zodResolver(formAuthorSubjectSchema),
    defaultValues: {
      nombre: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formAuthorSubjectSchema>) => {
    setFormLoading(true);

    if (entity === 'AUTHOR') {
      if (method === 'POST') {
        toast.promise(
          axiosInstance.post(
            `${import.meta.env.VITE_API_URL}/library/author/new`,
            values
          ),
          {
            loading: 'Guardando...',
            success: (res) => {
              if (res.status === 201) {
                fetchEntity();

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
            `${import.meta.env.VITE_API_URL}/library/author/update`,
            data
          ),
          {
            loading: 'Actualizando...',
            success: (res) => {
              if (res.status === 200) {
                fetchEntity();

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
      }
    } else {
      if (method === 'POST') {
        toast.promise(
          axiosInstance.post(
            `${import.meta.env.VITE_API_URL}/library/subject/new`,
            values
          ),
          {
            loading: 'Guardando...',
            success: (res) => {
              if (res.status === 201) {
                fetchEntity();

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
            `${import.meta.env.VITE_API_URL}/library/subject/update`,
            data
          ),
          {
            loading: 'Actualizando...',
            success: (res) => {
              if (res.status === 200) {
                fetchEntity();

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
      }
    }
  };

  useEffect(() => {
    if (method === 'PUT' && dataToUpdate) {
      form.setValue('nombre', dataToUpdate.nombre);
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {method === 'POST' && entity === 'AUTHOR' && 'Nuevo Libro'}
              {method === 'PUT' && entity === 'AUTHOR' && 'Editar Libro'}
              {method === 'POST' && entity === 'SUBJECT' && 'Nueva Materia'}
              {method === 'PUT' && entity === 'SUBJECT' && 'Editar Materia'}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {method === 'POST' &&
                entity === 'AUTHOR' &&
                'Por favor, complete los siguientes campos para agregar un nuevo autor.'}
              {method === 'PUT' &&
                entity === 'AUTHOR' &&
                'Por favor, revise y edita los campos deseados del autor.'}
              {method === 'POST' &&
                entity === 'SUBJECT' &&
                'Por favor, complete los siguientes campos para agregar una nueva materia.'}
              {method === 'PUT' &&
                entity === 'SUBJECT' &&
                'Por favor, revise y edita los campos deseados de la materia.'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`uppercase text-primary`}>
                    Nombre
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={formLoading}
                      className={`bg-gray-50 border-primary`}
                    />
                  </FormControl>
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

export default DialogAuthorSubject;
