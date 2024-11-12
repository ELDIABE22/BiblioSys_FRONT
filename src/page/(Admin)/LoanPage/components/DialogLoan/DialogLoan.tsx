import React, { useEffect, useState } from 'react';
import { DialogLoanProps } from './dialogLoan.type';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formLoanSchema } from '@/lib/zod';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { IBookData } from '@/page/(Admin)/BookPage/bookPage.type';
import { IStudentData } from '@/page/(Admin)/StudentPage/studentPage.type';
import { Input } from '@/components/ui/input';

const DialogLoan: React.FC<DialogLoanProps> = ({
  fetchLoans,
  method,
  dataToUpdate,
}) => {
  const [books, setBooks] = useState<IBookData[] | []>([]);
  const [students, setStudents] = useState<IStudentData[] | []>([]);
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchStudent = async () => {
    try {
      const [booksResponse, studentsResponse] = await Promise.all([
        axiosInstance(`${import.meta.env.VITE_API_URL}/library/book`),
        axiosInstance(`${import.meta.env.VITE_API_URL}/library/student`),
      ]);

      const books = await booksResponse.data;
      const students = await studentsResponse.data;

      setBooks(books);
      setStudents(students);
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

  const form = useForm<z.infer<typeof formLoanSchema>>({
    resolver: zodResolver(formLoanSchema),
    defaultValues: {
      estudiante: '',
      libro: '',
      fechaDevolucion: '',
      fechaPrestamo: '',
      estado: '',
    },
  });

  const state = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Devuelto', value: 'Devuelto' },
    { label: 'Vencido', value: 'Vencido' },
  ] as const;

  const onSubmit = async (values: z.infer<typeof formLoanSchema>) => {
    setFormLoading(true);

    const data = {
      idEstudiante: parseInt(values.estudiante),
      idLibro: parseInt(values.libro),
      fechaPrestamo: values.fechaPrestamo,
      fechaDevolucion: values.fechaDevolucion,
      estado: values.estado,
    };

    if (method === 'POST') {
      toast.promise(
        axiosInstance.post(`${import.meta.env.VITE_API_URL}/library/loan/new`, {
          ...data,
          estado: 'Activo',
        }),
        {
          loading: 'Guardando...',
          success: (res) => {
            if (res.status === 201) {
              fetchLoans();

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
      toast.promise(
        axiosInstance.put(
          `${import.meta.env.VITE_API_URL}/library/loan/update`,
          {
            ...data,
            id: dataToUpdate?.id,
          }
        ),
        {
          loading: 'Actualizando...',
          success: (res) => {
            if (res.status === 200) {
              fetchLoans();

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
      form.setValue('estudiante', dataToUpdate.estudiante.id.toString());
      form.setValue('libro', dataToUpdate.libro.id.toString());
      form.setValue('fechaDevolucion', dataToUpdate.fechaDevolucion.toString());
      form.setValue('fechaPrestamo', dataToUpdate.fechaPrestamo.toString());
      form.setValue('estado', dataToUpdate.estado);
    }
  }, [dataToUpdate, form, method]);

  useEffect(() => {
    fetchStudent();
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
      <DialogContent className="sm:max-w-[600px]">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>
              {method === 'POST' ? 'Nuevo Prestamo' : 'Actualizar Prestamo'}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {method === 'POST'
                ? 'Por favor, complete los siguientes campos para agregar un nuevo prestamo.'
                : 'Por favor, revise y edita los campos deseados del prestamo.'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="estudiante"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={`uppercase text-primary`}>
                    Estudiante
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={formLoading}
                          className={cn(
                            'justify-between px-3 border-primary',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? students
                                .find(
                                  (item) => item.id.toString() === field.value
                                )
                                ?.nombres.split(' ')[0] +
                              ' ' +
                              students
                                .find(
                                  (item) => item.id.toString() === field.value
                                )
                                ?.apellidos.split(' ')[0]
                            : 'Seleccionar estudiante'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {students.map((item) => {
                              const firstName = item.nombres?.split(' ')[0];
                              const lastName = item.apellidos?.split(' ')[0];
                              return (
                                <CommandItem
                                  disabled={formLoading}
                                  value={item.id.toString()}
                                  key={item.id}
                                  onSelect={() => {
                                    form.setValue(
                                      'estudiante',
                                      item.id.toString()
                                    );
                                  }}
                                >
                                  {`${firstName} ${lastName}`}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      item.id.toString() === field.value
                                        ? 'opacity-100 text-primary'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="libro"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={`uppercase text-primary`}>
                    Libro
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={formLoading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between px-3 border-primary',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? books.find(
                                (item) => item.id.toString() === field.value
                              )?.titulo
                            : 'Seleccionar libro'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {books.map((item) => (
                              <CommandItem
                                disabled={formLoading}
                                value={item.id.toString()}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue('libro', item.id.toString());
                                }}
                              >
                                {item.titulo}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    item.id.toString() === field.value
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
            <div className="flex w-full gap-3">
              <FormField
                control={form.control}
                name="fechaPrestamo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className={`uppercase text-primary`}>
                      Fecha De Prestamo
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={formLoading}
                        placeholder="Ingrese los nombres"
                        className={`bg-gray-50 border-primary`}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      La fecha debe ser a partir de hoy.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaDevolucion"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className={`uppercase text-primary`}>
                      Fecha De Devolución
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={formLoading}
                        placeholder="Ingrese los nombres"
                        className={`bg-gray-50 border-primary`}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      La fecha debe ser a partir de hoy.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
            <DialogFooter>
              <Button disabled={formLoading} type="submit">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLoan;
