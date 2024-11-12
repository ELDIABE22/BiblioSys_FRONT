export type DialogAuthorSubjectwProps = {
  fetchEntity: () => Promise<void>;
  entity: string;
  method: string;
  dataToUpdate?: {
    id: number;
    nombre: string;
  };
};
