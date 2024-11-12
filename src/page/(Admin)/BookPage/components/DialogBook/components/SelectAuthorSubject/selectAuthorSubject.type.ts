import { IAuthorData } from '@/page/(Admin)/AuthorPage/authorPage.type';
import { ISubjectData } from '@/page/(Admin)/SubjectPage/subjectPage.type';
import { UseFormReturn } from 'react-hook-form';

export type SelectAuthorSubjectProps = {
  form: UseFormReturn<{
    autores: number[];
    isbn: string;
    titulo: string;
    descripcion: string;
    genero: string;
    añoPublicacion: string;
    materias: number[];
  }>;
  formName: string;
  entity: IAuthorData[] | ISubjectData[];
  formLoading: boolean;
};
