import { ILoanData } from '../../loanPage.type';

export type DialogLoanProps = {
  fetchLoans: () => Promise<void>;
  method: string;
  dataToUpdate?: ILoanData;
};
