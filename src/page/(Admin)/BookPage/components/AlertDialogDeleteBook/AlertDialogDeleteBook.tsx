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
import { AlertDialogDeleteBookType } from './alertDialogDeleteBook.type';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import axios from 'axios';

const AlertDialogDeleteBook: React.FC<AlertDialogDeleteBookType> = ({
  bookId,
  fetchBooks,
}) => {
  const handleDelete = async () => {
    toast.promise(
      axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/library/book/${bookId}`
      ),
      {
        loading: 'Eliminando...',
        success: (res) => {
          if (res.status === 200) {
            console.log(res);
            fetchBooks();

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
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full" asChild>
        <Button variant="destructive">Eliminar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no puede revertir. Eliminará permanentemente el libro.
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
  );
};

export default AlertDialogDeleteBook;
