import { IStudentData } from '../../studentPage.type';

export type DialogStudentProps = {
  fetchStudents: () => Promise<void>;
  method: string;
  dataToUpdate?: IStudentData;
};
