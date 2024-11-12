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
import { formBookSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { DialogBookProps } from './dialogBook.type';
import { Textarea } from '@/components/ui/textarea';
import { IAuthorData } from '@/page/(Admin)/AuthorPage/authorPage.type';
import { ISubjectData } from '@/page/(Admin)/SubjectPage/subjectPage.type';
import SelectAuthorSubject from './components/SelectAuthorSubject/SelectAuthorSubject';

const DialogBook: React.FC<DialogBookProps> = ({
  fetchBooks,
  method,
  dataToUpdate,
}) => {
  const [authors, setAuthors] = useState<IAuthorData[] | []>([]);
  const [subjects, setSubjects] = useState<ISubjectData[] | []>([]);
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const form = useForm<z.infer<typeof formBookSchema>>({
    resolver: zodResolver(formBookSchema),
    defaultValues: {
      isbn: '',
      titulo: '',
      descripcion: '',
      genero: '',
      añoPublicacion: '',
      autores: [],
      materias: [],
    },
  });

  const fetchAuthorsAndSubjects = async () => {
    try {
      const [authorsResponse, subjectsResponse] = await Promise.all([
        axiosInstance(`${import.meta.env.VITE_API_URL}/library/author`),
        axiosInstance(`${import.meta.env.VITE_API_URL}/library/subject`),
      ]);

      const authors = await authorsResponse.data;
      const subjects = await subjectsResponse.data;

      setAuthors(authors);
      setSubjects(subjects);
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

  const onSubmit = async (values: z.infer<typeof formBookSchema>) => {
    setFormLoading(true);

    if (method === 'POST') {
      toast.promise(
        axiosInstance.post(
          `${import.meta.env.VITE_API_URL}/library/book/new`,
          values
        ),
        {
          loading: 'Guardando...',
          success: (res) => {
            if (res.status === 201) {
              console.log(res);
              fetchBooks();

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
          `${import.meta.env.VITE_API_URL}/library/book/update`,
          data
        ),
        {
          loading: 'Actualizando...',
          success: (res) => {
            if (res.status === 200) {
              fetchBooks();

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
      form.setValue('isbn', dataToUpdate.isbn);
      form.setValue('titulo', dataToUpdate.titulo);
      form.setValue('descripcion', dataToUpdate.descripcion);
      form.setValue('genero', dataToUpdate.genero);
      form.setValue('añoPublicacion', dataToUpdate.añoPublicacion.toString());
      form.setValue(
        'autores',
        dataToUpdate.autores.map((item) => item.id)
      );
      form.setValue(
        'materias',
        dataToUpdate.materias.map((item) => item.id)
      );
    }
  }, [dataToUpdate, form, method]);

  useEffect(() => {
    fetchAuthorsAndSubjects();
  }, []);

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
        <DialogContent className="sm:max-w-[920px]">
          <DialogHeader>
            <DialogTitle>
              {method === 'POST' ? 'Nuevo Libro' : 'Editar Libro'}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {method === 'POST'
                ? 'Por favor, complete los siguientes campos para agregar un nuevo libro.'
                : 'Por favor, revise y edita los campos deseados del libro.'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-5 w-full">
              <div className="space-y-3 w-[425px]">
                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`uppercase text-primary`}>
                        ISBN
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={formLoading}
                          placeholder="Ingrese el número de ISBN"
                          className={`bg-gray-50 border-primary`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`uppercase text-primary`}>
                        Título
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={formLoading}
                          placeholder="Ingrese el título del libro"
                          className={`bg-gray-50 border-primary`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`uppercase text-primary`}>
                        Género
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={formLoading}
                          placeholder="Ingrese el género literario"
                          className={`bg-gray-50 border-primary`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="añoPublicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`uppercase text-primary`}>
                        Edición
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={formLoading}
                          placeholder="Año de publicación"
                          className={`bg-gray-50 border-primary`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`uppercase text-primary`}>
                        Descripción
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={formLoading}
                          placeholder="Describe brevemente el contenido del libro"
                          className={`bg-gray-50 border-primary`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[425px] space-y-3">
                <FormField
                  control={form.control}
                  name="autores"
                  render={() => (
                    <FormItem>
                      <FormLabel className="uppercase text-primary">
                        Autores
                      </FormLabel>
                      <FormControl>
                        <SelectAuthorSubject
                          form={form}
                          formName="autores"
                          entity={authors}
                          formLoading={formLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="materias"
                  render={() => (
                    <FormItem>
                      <FormLabel className="uppercase text-primary">
                        Materias
                      </FormLabel>
                      <FormControl>
                        <SelectAuthorSubject
                          form={form}
                          formName="materias"
                          entity={subjects}
                          formLoading={formLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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

export default DialogBook;
