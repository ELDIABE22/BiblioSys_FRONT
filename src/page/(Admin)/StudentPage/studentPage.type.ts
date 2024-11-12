export interface IStudentData {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  direccion: string;
  telefono: number;
  carrera: string;
  foto?: string;
  estado: 'Activo' | 'Inactivo';
}
