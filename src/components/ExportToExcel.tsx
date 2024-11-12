import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';
import React from 'react';
import { IStudentData } from '@/page/(Admin)/StudentPage/studentPage.type';
import { IAuthorData } from '@/page/(Admin)/AuthorPage/authorPage.type';
import { ISubjectData } from '@/page/(Admin)/SubjectPage/subjectPage.type';
import { IBookData } from '@/page/(Admin)/BookPage/bookPage.type';
import { ILoanData } from '@/page/(Admin)/LoanPage/loanPage.type';
import { IUserData } from '@/page/(Admin)/UserPage/userPage.type';

type Props = {
  fileName: string;
  apiData: (
    | IStudentData
    | IAuthorData
    | ISubjectData
    | IBookData
    | ILoanData
    | IUserData
  )[];
};

export const ExportToExcel: React.FC<Props> = ({ apiData, fileName }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (
    data: (
      | IStudentData
      | IAuthorData
      | ISubjectData
      | IBookData
      | ILoanData
      | IUserData
    )[]
  ) => {
    // Verificar si data es un array y tiene elementos
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Los datos deben ser un array no vacío');
      return;
    }

    // Convertir data a una hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(data);

    // Crear el libro de trabajo
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

    // Escribir el libro de trabajo en un buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Crear un Blob con el buffer
    const dataBlob = new Blob([excelBuffer], { type: fileType });

    // Descargar el archivo como Excel
    FileSaver.saveAs(dataBlob, fileName + fileExtension);
  };

  return (
    <Button
      className="bg-[#008000] hover:bg-[#008000]/80"
      onClick={() => exportToCSV(apiData)}
    >
      <FileText /> EXCEL
    </Button>
  );
};
