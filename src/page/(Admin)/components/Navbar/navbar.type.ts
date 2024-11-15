export type NavbarProps = {
  fetchLoansOverdue: () => Promise<ILoansOverdueData[] | undefined>;
};

export interface ILoansOverdueData {
  idEstudiante: number;
  idLibro: number;
  nombresEstudiante: string;
  apellidosEstudiante: string;
  correoEstudiante: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  visto: boolean;
}
