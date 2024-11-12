import React from 'react';
import { AlertDialogDeleteUserType } from './alertDialogDeleteUser.type';
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
import axios from 'axios';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';

const AlertDialogDeleteUser: React.FC<AlertDialogDeleteUserType> = ({
  fetchUsers,
  userId,
}) => {
  const handleDelete = async () => {
    toast.promise(
      axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/library/user/${userId}`
      ),
      {
        loading: 'Eliminando...',
        success: (res) => {
          if (res.status === 200) {
            fetchUsers();

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
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no puede revertir. Eliminará permanentemente el usuario.
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

export default AlertDialogDeleteUser;
