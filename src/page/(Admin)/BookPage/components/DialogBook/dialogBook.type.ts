import { IBookData } from "../../bookPage.type";

export type DialogBookProps = {
  fetchBooks: () => Promise<void>;
  method: string;
  dataToUpdate?: IBookData;
};
