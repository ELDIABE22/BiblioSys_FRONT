import { IAuthorData } from '../AuthorPage/authorPage.type';
import { ISubjectData } from '../SubjectPage/subjectPage.type';

export interface IBookData {
  id: number;
  isbn: string;
  titulo: string;
  descripcion: string;
  genero: string;
  añoPublicacion: number;
  foto?: string;
  estado: 'Disponible' | 'Prestado';
  autores: IAuthorData[] | [];
  materias: ISubjectData[] | [];
}
