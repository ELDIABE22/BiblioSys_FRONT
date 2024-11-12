export interface IUserData {
  id: number;
  nombres: string;
  apellidos: string;
  usuario: string;
  correo: string;
  rol: 'Administrador' | 'Asistente';
  estado: 'Activo' | 'Inactivo';
}
