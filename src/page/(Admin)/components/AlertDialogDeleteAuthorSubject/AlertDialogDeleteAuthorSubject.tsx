import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import React from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { AlertDialogDeleteAuthorSubjectType } from './alertDialogDeleteAuthorSubject.type';

const AlertDialogDeleteAuthorSubject: React.FC<
  AlertDialogDeleteAuthorSubjectType
> = ({ id, fetchEntity, entity }) => {
  const handleDelete = async () => {
    if (entity === 'AUTHOR') {
      toast.promise(
        axiosInstance.delete(
          `${import.meta.env.VITE_API_URL}/library/author/${id}`
        ),
        {
          loading: 'Eliminando...',
          success: (res) => {
            if (res.status === 200) {
              fetchEntity();

              return res.data.message;
            }
          },
          error: (error) => {
            console.log(error);
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
        axiosInstance.delete(
          `${import.meta.env.VITE_API_URL}/library/subject/${id}`
        ),
        {
          loading: 'Eliminando...',
          success: (res) => {
            if (res.status === 200) {
              fetchEntity();

              return res.data.message;
            }
          },
          error: (error) => {
            console.log(error);
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

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className="w-full" asChild>
          <Button variant="destructive">Eliminar</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Esta acción no puede revertir. Eliminará permanentemente ${
                entity === 'AUTHOR' ? 'el libro.' : 'la materia.'
              }`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertDialogDeleteAuthorSubject;
