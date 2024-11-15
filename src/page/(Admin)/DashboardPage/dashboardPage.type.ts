export interface IDetails {
  totalPrestamos: number;
  totalLibros: number;
  totalEstudiantes: number;
  totalUsuarios: number;
}

export interface ILoanAmountPerDay {
  dia: string;
  prestamos: number;
}

export interface ILoanAmountPerMonth {
  mes: string;
  total: number;
}

export interface ITop5MostLoanedBooks {
  libro: string;
  total: number;
}
