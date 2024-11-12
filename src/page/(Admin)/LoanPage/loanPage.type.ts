export interface ILoanData {
  id: number;
  estudiante: {
    id: number;
    nombres: string;
    apellidos: string;
  };
  libro: {
    id: number;
    title: string;
  };
  fechaDevolucion: Date;
  fechaPrestamo: Date;
  estado: 'Activo' | 'Devuelto' | 'Vencido';
}
