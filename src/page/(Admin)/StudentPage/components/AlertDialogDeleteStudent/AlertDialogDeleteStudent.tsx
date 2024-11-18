import React from 'react';
import { AlertDialogDeleteStudentType } from './alertDialogDeleteStudent.type';
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
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import axios from 'axios';

const AlertDialogDeleteStudent: React.FC<AlertDialogDeleteStudentType> = ({
  studentId,
  fetchStudents,
}) => {
  const handleDelete = async () => {
    toast.promise(
      axiosInstance.delete(
        `${import.meta.env.VITE_API_URL}/library/student/${studentId}`
      ),
      {
        loading: 'Eliminando...',
        success: (res) => {
          if (res.status === 200) {
            fetchStudents();

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
            Esta acción no puede revertirse. Eliminará permanentemente al
            estudiante y sus préstamos.
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

export default AlertDialogDeleteStudent;
