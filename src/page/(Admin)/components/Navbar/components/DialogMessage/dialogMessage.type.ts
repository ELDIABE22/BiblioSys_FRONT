import { ILoansOverdueData } from '../../navbar.type';

export type DialogMessageProps = {
  data: ILoansOverdueData;
  fetchLoansOverdue: () => Promise<ILoansOverdueData[] | undefined>;
  setData: React.Dispatch<React.SetStateAction<[] | ILoansOverdueData[]>>;
};
