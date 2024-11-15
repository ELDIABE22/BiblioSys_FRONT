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
import { formMessageStudentSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, UsersRound } from 'lucide-react';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DialogMessageProps } from './dialogMessage.type';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { ILoansOverdueData } from '../../navbar.type';

const DialogMessage: React.FC<DialogMessageProps> = ({
  data,
  fetchLoansOverdue,
  setData,
}) => {
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const form = useForm<z.infer<typeof formMessageStudentSchema>>({
    resolver: zodResolver(formMessageStudentSchema),
    defaultValues: {
      correo: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formMessageStudentSchema>) => {
    setFormLoading(true);

    toast.promise(
      axiosInstance.post(
        `${import.meta.env.VITE_API_URL}/library/loan/overdue`,
        { correo: data.correoEstudiante, message: values.message }
      ),
      {
        loading: 'Enviando...',
        success: (res) => {
          if (res.status === 200) {
            form.reset();

            const loansOverdue: ILoansOverdueData[] = JSON.parse(
              localStorage.getItem('loansOverdue') || '[]'
            );

            const updatedLoansOverdue: ILoansOverdueData[] = loansOverdue.map(
              (item: ILoansOverdueData) => {
                if (item.correoEstudiante === data.correoEstudiante) {
                  return { ...item, visto: true };
                }
                return item;
              }
            );

            localStorage.setItem(
              'loansOverdue',
              JSON.stringify(updatedLoansOverdue)
            );

            fetchLoansOverdue().then((fetchedData) => {
              if (fetchedData) {
                setData(fetchedData);
              }
              setOpen(false);
              setFormLoading(false);
            });

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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="flex justify-between p-3 border-b hover:bg-black/10 cursor-pointer">
          <div>
            <div
              className="p-4 rounded-full shadow-lg"
              style={{ backgroundColor: '#1b4dff' }}
            >
              <UsersRound color="#FFFFFF" size={20} />
            </div>
          </div>
          <div>
            <p className="text-sm">{`${data?.nombresEstudiante.split(' ')[0]} ${
              data?.apellidosEstudiante.split(' ')[0]
            }`}</p>
            <span className="text-xs text-gray-500">
              Préstamo: {data.fechaPrestamo}
            </span>
          </div>
          <div className="flex flex-col justify-between items-end">
            <span className="text-xs text-[#f71735]">
              {data.fechaDevolucion}
            </span>
            <Mail size={15} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Enviar Mensaje</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Envía un mensaje al estudiante con la fecha del libro vencida.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
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
                      value={data.correoEstudiante}
                      defaultValue={data.correoEstudiante}
                      disabled
                      placeholder="Ingrese el correo del estudiante"
                      className={`bg-gray-50`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={() => (
                <FormItem>
                  <FormLabel className={`uppercase text-primary`}>
                    Mensaje
                  </FormLabel>
                  <FormControl>
                    <Controller
                      name="message"
                      control={form.control}
                      render={({ field }) => (
                        <ReactQuill
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          modules={{
                            toolbar: [
                              ['bold', 'italic', 'underline'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              ['link'],
                            ],
                          }}
                          formats={[
                            'bold',
                            'italic',
                            'underline',
                            'list',
                            'bullet',
                            'link',
                          ]}
                          className={`bg-gray-50 m-0`}
                          readOnly={formLoading}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Enviar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogMessage;
