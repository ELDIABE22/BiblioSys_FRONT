import { IUserData } from '../../userPage.type';

export type DialogUserProps = {
  fetchUsers: () => Promise<void>;
  method: string;
  dataToUpdate?: IUserData;
};
