import { z } from 'zod';

export const formLoginSchema = z.object({
  usuario: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(3, 'Mínimo 3 caracteres')
    .max(10, 'Máximo 10 caracteres'),
  contraseña: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(6, 'Mínimo 6 caracteres')
    .max(15, 'Máximo 15 caracteres'),
});

export const formResetPassword = z.object({
  contraseña: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(6, 'Mínimo 6 caracteres')
    .max(15, 'Máximo 15 caracteres'),
  confirmContraseña: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(6, 'Mínimo 6 caracteres')
    .max(15, 'Máximo 15 caracteres'),
});

export const formCorreoSchema = z.object({
  correo: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .email('El correo no es válido'),
});

export const formAuthorSubjectSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres'),
});

export const formBookSchema = z.object({
  isbn: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(10, 'Mínimo 10 caracteres')
    .max(10, 'Máximo 10 caracteres'),
  titulo: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(3, 'Mínimo 3 caracteres')
    .max(150, 'Máximo 150 caracteres'),
  descripcion: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(10, 'Mínimo 10 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  genero: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(5, 'Mínimo 5 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  añoPublicacion: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(4, 'Mínimo 4 caracteres')
    .max(4, 'Máximo 4 caracteres'),
  autores: z.array(z.number()).min(1, 'Se requiere al menos un autor'),
  materias: z.array(z.number()).min(1, 'Se requiere al menos una materia'),
});

export const formStudentSchema = z.object({
  nombres: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  apellidos: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  correo: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .email('El correo no es válido'),
  direccion: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(5, 'Mínimo 5 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  telefono: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(10, 'Mínimo 10 caracteres')
    .max(10, 'Máximo 10 caracteres')
    .regex(/^\d+$/, 'Solo se permiten números'),
  carrera: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(5, 'Mínimo 5 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  estado: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length >= 1, 'Se requiere'),
});

export const formUserSchema = z.object({
  nombres: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  apellidos: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(3, 'Mínimo 3 caracteres')
    .max(255, 'Máximo 255 caracteres'),
  usuario: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(3, 'Mínimo 3 caracteres')
    .max(10, 'Máximo 10 caracteres'),
  correo: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .email('El correo no es válido'),
  rol: z.string().trim().min(1, 'Se requiere'),
  estado: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length >= 1, 'Se requiere'),
});

export const formLoanSchema = z.object({
  estudiante: z.string().trim().min(1, 'Se requiere'),
  libro: z.string().trim().min(1, 'Se requiere'),
  fechaDevolucion: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .transform((dateString) => {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    })
    .refine((date) => {
      if (!date) return false;

      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate() + 1;

      if (!(year === new Date().getFullYear())) {
        return false;
      }

      if (!(month >= 1 && month <= 12)) {
        return false;
      }

      const maxDays = new Date(year, month, 0).getDate();
      if (!(day >= 1 && day <= maxDays)) {
        return false;
      }

      const today = new Date();
      const todayWithoutTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      if (adjustedDate < todayWithoutTime) {
        return false;
      }

      return true;
    }, 'Ingrese una fecha válida')
    .transform((date) => {
      if (date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}`;
      }
    }),
  fechaPrestamo: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .transform((dateString) => {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return null;
      }

      return date;
    })
    .refine((date) => {
      if (!date) return false;

      const adjustedDate = new Date(date);
      adjustedDate.setDate(adjustedDate.getDate() + 1);

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate() + 1;

      if (!(year === new Date().getFullYear())) {
        return false;
      }

      if (!(month >= 1 && month <= 12)) {
        return false;
      }

      const maxDays = new Date(year, month, 0).getDate();
      if (!(day >= 1 && day <= maxDays)) {
        return false;
      }

      const today = new Date();
      const todayWithoutTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      if (adjustedDate < todayWithoutTime) {
        return false;
      }

      return true;
    }, 'Ingrese una fecha válida')
    .transform((date) => {
      if (date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month.toString().padStart(2, '0')}-${day
          .toString()
          .padStart(2, '0')}`;
      }
    }),
  estado: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length >= 1, 'Se requiere'),
});

export const formMessageStudentSchema = z.object({
  correo: z.string().trim(),
  message: z
    .string()
    .trim()
    .min(1, 'Se requiere')
    .min(15, 'Mínimo 15 caracteres')
    .max(255, 'Máximo 255 caracteres'),
});
