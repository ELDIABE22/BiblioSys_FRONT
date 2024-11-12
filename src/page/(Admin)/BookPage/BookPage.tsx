import axiosInstance from '@/lib/axios';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IBookData } from './bookPage.type';
import { Button } from '@/components/ui/button';
import {
  ChevronsLeft,
  ChevronsRight,
  FileText,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { IAuthorData } from '../AuthorPage/authorPage.type';
import { ISubjectData } from '../SubjectPage/subjectPage.type';
import DialogBook from './components/DialogBook/DialogBook';
import AlertDialogDeleteBook from './components/AlertDialogDeleteBook/AlertDialogDeleteBook';
import { Badge } from '@/components/ui/badge';
import { ExportToExcel } from '@/components/ExportToExcel';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExportToPDF, { ITableConfig } from '@/components/ExportToPDF';

const BookPage = () => {
  const [data, setData] = useState<IBookData[] | []>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);

  const pageSize = 5;

  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/library/book`
      );
      setData(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status !== undefined &&
          error.response?.status >= 400 &&
          error.response?.status <= 499
        ) {
          toast.error(
            error.response?.data.mensaje ||
              error.response?.data.message ||
              'Error interno, intenta más tarde!',
            {
              iconTheme: {
                primary: '#1b4dff',
                secondary: '#fff',
              },
            }
          );
        } else {
          toast.error('Error interno, intenta más tarde!', {
            iconTheme: {
              primary: '#1b4dff',
              secondary: '#fff',
            },
          });
        }
      } else {
        toast.error('Error interno, intenta más tarde!', {
          iconTheme: {
            primary: '#1b4dff',
            secondary: '#fff',
          },
        });
      }
    }
  };

  const bookTableConfig: ITableConfig = {
    headers: [
      'ID',
      'ISBN',
      'Título',
      'Descripción',
      'Género',
      'Año Publicación',
      'Estado',
    ],
    dataKeys: [
      'id',
      'isbn',
      'titulo',
      'descripcion',
      'genero',
      'añoPublicacion',
      'estado',
    ],
  };

  const columns: ColumnDef<IBookData>[] = [
    {
      accessorKey: 'isbn',
      header: 'ISBN',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('isbn')}</div>
      ),
    },
    {
      accessorKey: 'titulo',
      header: 'Título',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('titulo')}</div>
      ),
    },
    {
      accessorKey: 'genero',
      header: 'Genero',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('genero')}</div>
      ),
    },
    {
      accessorKey: 'añoPublicacion',
      header: 'Edición',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('añoPublicacion')}</div>
      ),
    },
    {
      accessorKey: 'autores',
      header: 'Autores',
      cell: ({ row }) => (
        <div className="capitalize">
          {(row.getValue('autores') as IAuthorData[])
            .map((autor) => autor.nombre)
            .join(', ')}
        </div>
      ),
    },
    {
      accessorKey: 'materias',
      header: 'Materias',
      cell: ({ row }) => (
        <div className="capitalize">
          {(row.getValue('materias') as ISubjectData[])
            .map((autor) => autor.nombre)
            .join(', ')}
        </div>
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.estado === 'Disponible' ? 'default' : 'destructive'
          }
        >
          {row.getValue('estado')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="space-y-1 max-w-11">
            <DialogBook
              method="PUT"
              dataToUpdate={row.original}
              fetchBooks={fetchBooks}
            />
            <AlertDialogDeleteBook
              bookId={row.original.id}
              fetchBooks={fetchBooks}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <section className="mx-5 space-y-5">
      <div className="flex space-x-1 max-w-24">
        <DialogBook method="POST" fetchBooks={fetchBooks} />

        <PDFDownloadLink
          document={
            <ExportToPDF
              title="Listado de Libros"
              data={data}
              tableConfig={bookTableConfig}
            />
          }
          fileName="Libros.pdf"
        >
          <Button className="bg-[#FF0000] hover:bg-[#FF0000]/80">
            <FileText /> PDF
          </Button>
        </PDFDownloadLink>

        <ExportToExcel apiData={data} fileName={'Libros'} />
      </div>

      {/* TABLE */}
      <div className="border p-5 space-y-5">
        <h2 className="text-center font-bold text-xl border-b-2 border-primary pb-3">
          Listado de Libros
        </h2>
        <Input
          placeholder="Buscar por titulo..."
          value={(table.getColumn('titulo')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('titulo')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-primary">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="text-white" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'Seleccionado'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              table.previousPage();
              setPageIndex(table.getState().pagination.pageIndex - 1);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              table.nextPage();
              setPageIndex(table.getState().pagination.pageIndex + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BookPage;
