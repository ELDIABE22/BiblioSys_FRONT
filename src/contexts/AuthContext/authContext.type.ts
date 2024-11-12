import { formLoginSchema } from '@/lib/zod';
import { ReactNode } from 'react';
import { z } from 'zod';

export type Props = {
  children: ReactNode;
};

export interface IAuthUser {
  id: number;
  usuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: 'Administrador' | 'Asistente';
}

export interface IAuthContextValue {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  formLoading: boolean;
  signin: (values: z.infer<typeof formLoginSchema>) => Promise<void>;
  logout: () => void;
}
